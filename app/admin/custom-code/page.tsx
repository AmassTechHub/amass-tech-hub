"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2, Search, Edit, Trash2, Code, Monitor, Smartphone, Tablet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomCode {
  id: string;
  name: string;
  description: string | null;
  code: string;
  location: 'head' | 'body_start' | 'body_end';
  device_type: 'all' | 'desktop' | 'tablet' | 'mobile';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CustomCodePage() {
  const [snippets, setSnippets] = useState<CustomCode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState<string>("")
  const [deviceFilter, setDeviceFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchSnippets()
  }, [])

  const fetchSnippets = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('custom_code')
        .select('*')
        .order('created_at', { ascending: false })

      if (locationFilter) {
        query = query.eq('location', locationFilter)
      }

      if (deviceFilter) {
        query = query.eq('device_type', deviceFilter)
      }

      if (statusFilter) {
        query = query.eq('is_active', statusFilter === 'active')
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setSnippets(data || [])
    } catch (error) {
      console.error("Error fetching code snippets:", error)
      toast({
        title: "Error",
        description: "Failed to load code snippets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code snippet?")) return;
    
    try {
      const { error } = await supabase
        .from('custom_code')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSnippets(snippets.filter(snippet => snippet.id !== id));
      toast({
        title: "Success",
        description: "Code snippet deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting code snippet:", error);
      toast({
        title: "Error",
        description: "Failed to delete code snippet. Please try again.",
        variant: "destructive",
      });
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_code')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setSnippets(snippets.map(snippet => 
        snippet.id === id ? { ...snippet, is_active: !currentStatus } : snippet
      ));
      
      toast({
        title: "Success",
        description: `Code snippet ${!currentStatus ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error("Error updating code snippet status:", error);
      toast({
        title: "Error",
        description: `Failed to ${!currentStatus ? 'enable' : 'disable'} code snippet. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Custom Code</h1>
          <p className="text-muted-foreground">
            Manage custom CSS and JavaScript code snippets
          </p>
        </div>
        <Button onClick={() => router.push("/admin/custom-code/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Snippet
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchSnippets()}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              <SelectItem value="head">Head</SelectItem>
              <SelectItem value="body_start">Body Start</SelectItem>
              <SelectItem value="body_end">Body End</SelectItem>
            </SelectContent>
          </Select>
          <Select value={deviceFilter} onValueChange={setDeviceFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Devices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Devices</SelectItem>
              <SelectItem value="all">All Devices</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchSnippets}>
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {snippets.length > 0 ? (
              snippets.map((snippet) => (
                <TableRow key={snippet.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-muted-foreground" />
                      <span>{snippet.name}</span>
                    </div>
                    {snippet.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {snippet.description.length > 60 
                          ? `${snippet.description.substring(0, 60)}...` 
                          : snippet.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {snippet.location === 'head' ? 'Head' : 
                       snippet.location === 'body_start' ? 'Body Start' : 'Body End'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getDeviceIcon(snippet.device_type)}
                      <span className="capitalize">{snippet.device_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${snippet.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span>{snippet.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(snippet.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/custom-code/${snippet.id}`)}
                        aria-label="Edit code snippet"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStatus(snippet.id, snippet.is_active)}
                        className={snippet.is_active ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"}
                        aria-label={snippet.is_active ? "Deactivate snippet" : "Activate snippet"}
                      >
                        {snippet.is_active ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(snippet.id)}
                        className="text-destructive hover:text-destructive/80"
                        aria-label="Delete code snippet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {snippets.length === 0 ? 'No code snippets found. Add your first snippet!' : 'No snippets match your search criteria.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

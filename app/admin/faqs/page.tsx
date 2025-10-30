"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2, Search, Edit, Trash2, HelpCircle } from "lucide-react"
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

interface Category {
  id: string;
  name: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category_id: string | null;
  categories: Category | null;
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
    fetchFAQs()
  }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .eq('type', 'faq')
      .order('name')
    
    if (data) setCategories(data)
  }

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('faqs')
        .select(`
          *,
          categories (name)
        `)
        .order('order_index', { ascending: true })

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory)
      }

      if (searchQuery) {
        query = query.or(`question.ilike.%${searchQuery}%,answer.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setFaqs(data || [])
    } catch (error) {
      console.error("Error fetching FAQs:", error)
      toast({
        title: "Error",
        description: "Failed to load FAQs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setFaqs(faqs.filter((faq) => faq.id !== id));
      toast({
        title: "Success",
        description: "FAQ deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ. Please try again.",
        variant: "destructive",
      });
    }
  }

  const updateFAQOrder = async (id: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ order_index: newOrder })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the list
      fetchFAQs();
    } catch (error) {
      console.error("Error updating FAQ order:", error);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const newFAQs = [...faqs];
    const temp = newFAQs[index].order_index;
    newFAQs[index].order_index = newFAQs[index - 1].order_index;
    newFAQs[index - 1].order_index = temp;
    
    setFaqs(newFAQs.sort((a, b) => a.order_index - b.order_index));
    
    // Update in database
    updateFAQOrder(newFAQs[index].id, newFAQs[index].order_index);
    updateFAQOrder(newFAQs[index - 1].id, newFAQs[index - 1].order_index);
  };

  const handleMoveDown = (index: number) => {
    if (index === faqs.length - 1) return;
    
    const newFAQs = [...faqs];
    const temp = newFAQs[index].order_index;
    newFAQs[index].order_index = newFAQs[index + 1].order_index;
    newFAQs[index + 1].order_index = temp;
    
    setFaqs(newFAQs.sort((a, b) => a.order_index - b.order_index));
    
    // Update in database
    updateFAQOrder(newFAQs[index].id, newFAQs[index].order_index);
    updateFAQOrder(newFAQs[index + 1].id, newFAQs[index + 1].order_index);
  };

  const filteredFAQs = searchQuery.trim() === "" && !selectedCategory
    ? faqs
    : faqs.filter((faq) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = searchQuery === "" ||
          faq.question.toLowerCase().includes(searchLower) ||
          faq.answer.toLowerCase().includes(searchLower) ||
          (faq.categories?.name.toLowerCase().includes(searchLower) ?? false);
        
        const matchesCategory = !selectedCategory || faq.category_id === selectedCategory;
        
        return matchesSearch && matchesCategory;
      });

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
          <h1 className="text-2xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">
            Manage frequently asked questions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Button 
            onClick={() => router.push("/admin/faqs/new")} 
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            New FAQ
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <button 
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="disabled:opacity-30"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <span>{index + 1}</span>
                      <button 
                        onClick={() => handleMoveDown(index)}
                        disabled={index === filteredFAQs.length - 1}
                        className="disabled:opacity-30"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{faq.question}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {faq.answer.replace(/<[^>]*>?/gm, '')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {faq.categories?.name || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={faq.status === 'published' ? 'default' : 'secondary'}>
                      {faq.status || 'draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/faqs/${faq.id}`)}
                        aria-label="Edit FAQ"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(faq.id)}
                        className="text-destructive hover:text-destructive/80"
                        aria-label="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {faqs.length === 0 ? 'No FAQs found. Add your first FAQ!' : 'No FAQs match your search criteria.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

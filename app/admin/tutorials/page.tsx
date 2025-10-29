"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2, Search, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tutorial } from "@/lib/content-types"

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchTutorials()
  }, [])

  const fetchTutorials = async () => {
    try {
      const response = await fetch("/api/content?type=tutorial")
      const data = await response.json()
      setTutorials(data)
    } catch (error) {
      console.error("Error fetching tutorials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tutorial?")) return
    
    try {
      await fetch(`/api/content/${id}`, {
        method: "DELETE",
      })
      setTutorials(tutorials.filter((tutorial) => tutorial.id !== id))
    } catch (error) {
      console.error("Error deleting tutorial:", error)
    }
  }

  const filteredTutorials = tutorials.filter((tutorial) =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
          <h1 className="text-2xl font-bold">Tutorials</h1>
          <p className="text-muted-foreground">
            Manage your tutorials and learning resources
          </p>
        </div>
        <Button onClick={() => router.push("/admin/tutorials/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Tutorial
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tutorials..."
          className="w-full bg-background pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTutorials.length > 0 ? (
              filteredTutorials.map((tutorial) => (
                <TableRow key={tutorial.id}>
                  <TableCell className="font-medium">{tutorial.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tutorial.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={tutorial.difficulty === 'beginner' ? 'success' : 
                              tutorial.difficulty === 'intermediate' ? 'warning' : 'destructive'}
                    >
                      {tutorial.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tutorial.published ? 'default' : 'outline'}>
                      {tutorial.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(tutorial.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(`/tutorials/${tutorial.slug}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/tutorials/${tutorial.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tutorial.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No tutorials found matching your search.' : 'No tutorials found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

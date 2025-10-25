"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Eye, RefreshCw } from "lucide-react"

interface Article {
  id: string
  title: string
  category: string
  published: boolean
  views: number
  created_at: string
  authors?: {
    name: string
  }
}

export default function PostsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch articles from database
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchArticles() // Refresh the list
      } else {
        alert('Failed to delete article')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Failed to delete article')
    }
  }

  const filteredPosts = articles.filter((post) => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts</h1>
          <p className="text-muted-foreground">Manage all your blog posts and news articles</p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="gap-2">
            <Plus size={20} />
            New Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>Total: {filteredPosts.length} posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Views</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-border hover:bg-card transition-colors">
                    <td className="py-3 px-4">{post.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          post.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{post.views}</td>
                    <td className="py-3 px-4">{post.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-card rounded transition-colors" title="View">
                          <Eye size={16} className="text-muted-foreground" />
                        </button>
                        <button className="p-1 hover:bg-card rounded transition-colors" title="Edit">
                          <Edit2 size={16} className="text-muted-foreground" />
                        </button>
                        <button className="p-1 hover:bg-card rounded transition-colors" title="Delete">
                          <Trash2 size={16} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

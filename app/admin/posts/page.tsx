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
  slug: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views: number
  created_at: string
  published_at?: string
  categories?: {
    name: string
    color: string
  }
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

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchArticles() // Refresh the list
      } else {
        alert('Failed to update article status')
      }
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Failed to update article status')
    }
  }

  const filteredPosts = articles.filter((post) => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div>
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
                  <th className="text-left py-3 px-4 font-semibold">Featured</th>
                  <th className="text-left py-3 px-4 font-semibold">Views</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="border-b border-border hover:bg-card transition-colors">
                    <td className="py-3 px-4">
                      <div className="max-w-xs truncate" title={post.title}>
                        {post.title}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {post.categories ? (
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: `${post.categories.color}20`, 
                            color: post.categories.color 
                          }}
                        >
                          {post.categories.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No category</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStatusToggle(post.id, post.status)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          post.status === "published" 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        {post.status}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      {post.featured ? (
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium">
                          Featured
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{post.views}</td>
                    <td className="py-3 px-4">
                      {formatDate(post.published_at || post.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link 
                          href={`/news/${post.slug}`}
                          className="p-1 hover:bg-card rounded transition-colors" 
                          title="View"
                        >
                          <Eye size={16} className="text-muted-foreground" />
                        </Link>
                        <Link 
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-1 hover:bg-card rounded transition-colors" 
                          title="Edit"
                        >
                          <Edit2 size={16} className="text-muted-foreground" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-1 hover:bg-card rounded transition-colors" 
                          title="Delete"
                        >
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

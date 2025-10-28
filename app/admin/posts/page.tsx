"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Eye, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

interface Article {
  id: string
  title: string
  slug: string
  status: "draft" | "published" | "archived"
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

  // ✅ Fetch all articles
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/articles")
      const data = await response.json()
      if (response.ok) {
        setArticles(data.articles || [])
      } else {
        toast.error("Failed to load articles")
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      toast.error("Error fetching articles")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Delete an article
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id))
        toast.success("Article deleted successfully")
      } else {
        toast.error("Failed to delete article")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast.error("Error deleting article")
    }
  }

  // ✅ Toggle published/draft status
  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Post ${newStatus === "published" ? "published" : "unpublished"}`)
        fetchArticles()
      } else {
        toast.error("Failed to update post status")
      }
    } catch (error) {
      console.error("Error updating article:", error)
      toast.error("Error updating article")
    }
  }

  const filteredPosts = articles.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
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

      {/* Posts Table */}
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

          {filteredPosts.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No posts found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-4 font-semibold">Title</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Featured</th>
                    <th className="py-3 px-4 font-semibold">Views</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-border hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-4 max-w-xs truncate">{post.title}</td>
                      <td className="py-3 px-4">
                        {post.categories ? (
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{
                              backgroundColor: post.categories.color
                                ? `${post.categories.color}20`
                                : "#3c0a6b20",
                              color: post.categories.color || "#3c0a6b",
                            }}
                          >
                            {post.categories.name || "Uncategorized"}
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
                      <td className="py-3 px-4">{post.views || 0}</td>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

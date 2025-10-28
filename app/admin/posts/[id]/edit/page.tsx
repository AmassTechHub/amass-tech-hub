"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface Author {
  id: string
  name: string
  email: string
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category_id: "",
    author_id: "",
    featured_image: "",
    tags: "",
    featured: false,
    status: "draft",
    seo_title: "",
    seo_description: "",
  })

  // ✅ Fetch initial post data, categories, authors
  useEffect(() => {
    if (postId) {
      fetchPost()
      fetchCategories()
      fetchAuthors()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/articles/${postId}`)
      if (res.ok) {
        const data = await res.json()
        const post = data.article

        setFormData({
          title: post.title || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          category_id: post.category_id || "",
          author_id: post.author_id || "",
          featured_image: post.featured_image || "",
          tags: post.tags?.join(", ") || "",
          featured: post.featured || false,
          status: post.status || "draft",
          seo_title: post.seo_title || "",
          seo_description: post.seo_description || "",
        })
      } else {
        toast.error("Failed to load post data")
      }
    } catch (error) {
      console.error("Error loading post:", error)
      toast.error("Error loading post")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      }
    } catch (err) {
      console.error("Error loading categories:", err)
    }
  }

  const fetchAuthors = async () => {
    try {
      const res = await fetch("/api/authors")
      if (res.ok) {
        const data = await res.json()
        setAuthors(data.authors || [])
      }
    } catch (err) {
      console.error("Error loading authors:", err)
    }
  }

  // ✅ Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const res = await fetch(`/api/articles/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tags: tagsArray }),
      })

      if (res.ok) {
        toast.success("Post updated successfully ✨")
        router.push("/admin/posts")
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to update post")
      }
    } catch (error) {
      console.error("Error updating post:", error)
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading post data...
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Posts
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
          <p className="text-muted-foreground">Update content and metadata</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>Edit your article details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter article title"
                  required
                />

                <Label>Excerpt *</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  rows={3}
                  required
                />

                <Label>Content *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  rows={15}
                  required
                />

                <Label>Featured Image URL</Label>
                <Input
                  value={formData.featured_image}
                  onChange={(e) => handleInputChange("featured_image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />

                <Label>Tags</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Separate tags with commas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>SEO Title</Label>
                <Input
                  value={formData.seo_title}
                  onChange={(e) => handleInputChange("seo_title", e.target.value)}
                />

                <Label>SEO Description</Label>
                <Textarea
                  value={formData.seo_description}
                  onChange={(e) => handleInputChange("seo_description", e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => handleInputChange("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>Author *</Label>
                <Select
                  value={formData.author_id}
                  onValueChange={(value) => handleInputChange("author_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                  <Label htmlFor="featured">Featured Article</Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={saving} className="w-full">
              {saving && <Save className="animate-spin mr-2" size={16} />}
              {saving ? "Saving..." : "Update Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

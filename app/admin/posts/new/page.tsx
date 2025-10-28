"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [loadingAuthors, setLoadingAuthors] = useState(true)

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

  // ✅ Fetch categories and authors
  useEffect(() => {
    fetchCategories()
    fetchAuthors()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoadingCats(true)
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        if (data.categories?.length > 0) {
          setCategories(data.categories)
        } else {
          toast("No categories found yet. Add some first!")
        }
      } else {
        toast.error("Failed to load categories")
      }
    } catch (err) {
      console.error("Error loading categories:", err)
      toast.error("Error fetching categories")
    } finally {
      setLoadingCats(false)
    }
  }

  const fetchAuthors = async () => {
    try {
      setLoadingAuthors(true)
      const res = await fetch("/api/authors")
      if (res.ok) {
        const data = await res.json()
        setAuthors(data.authors || [])
      }
    } catch (err) {
      console.error("Error loading authors:", err)
    } finally {
      setLoadingAuthors(false)
    }
  }

  // ✅ Handle submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, tags: tagsArray }),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success("Article created successfully ✨")
        router.push(`/admin/posts/${data.article.id}/edit`)
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to create article")
      }
    } catch (error) {
      console.error("Error creating article:", error)
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fade-in">
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Link href="/admin/posts">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Posts
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
          <p className="text-muted-foreground">Write and publish a new article</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>Write your article content here</CardDescription>
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
                  placeholder="Short preview for readers"
                  rows={3}
                  required
                />

                <Label>Content *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your article content here..."
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
                <p className="text-sm text-muted-foreground mt-1">Separate tags with commas</p>
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
                  placeholder="SEO optimized title"
                />

                <Label>SEO Description</Label>
                <Textarea
                  value={formData.seo_description}
                  onChange={(e) => handleInputChange("seo_description", e.target.value)}
                  placeholder="SEO optimized description"
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar section */}
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
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
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
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingCats ? "Loading..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        No categories available
                      </div>
                    )}
                  </SelectContent>
                </Select>

                <Label>Author *</Label>
                <Select
                  value={formData.author_id}
                  onValueChange={(value) => handleInputChange("author_id", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingAuthors ? "Loading..." : "Select author"} />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.length > 0 ? (
                      authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        No authors available
                      </div>
                    )}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                  <Label htmlFor="featured">Featured Article</Label>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Save className="animate-spin mr-2" size={16} />}
              {loading ? "Saving..." : "Save Article"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

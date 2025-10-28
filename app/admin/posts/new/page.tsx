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
import { ArrowLeft, Save, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

  // Modal state
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const [openAuthorModal, setOpenAuthorModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newAuthor, setNewAuthor] = useState({ name: "", email: "", avatar_url: "" })

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

  // ✅ Fetch data
  useEffect(() => {
    fetchCategories()
    fetchAuthors()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoadingCats(true)
      const res = await fetch("/api/categories")
      const data = await res.json()
      if (res.ok) setCategories(data.categories || [])
      else toast.error(data.error || "Failed to load categories")
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
      const data = await res.json()
      if (res.ok) setAuthors(data.authors || [])
      else toast.error(data.error || "Failed to load authors")
    } catch (err) {
      console.error("Error loading authors:", err)
      toast.error("Error fetching authors")
    } finally {
      setLoadingAuthors(false)
    }
  }

  // ✅ Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) {
      toast.error("Category name is required")
      return
    }

    try {
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, slug }),
      })

      if (res.ok) {
        toast.success("Category added ✅")
        setOpenCategoryModal(false)
        setNewCategoryName("")
        fetchCategories()
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to add category")
      }
    } catch (err) {
      console.error("Error adding category:", err)
      toast.error("Error adding category")
    }
  }

  // ✅ Add Author
  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAuthor.name.trim() || !newAuthor.email.trim()) {
      toast.error("Name and email are required")
      return
    }

    try {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAuthor),
      })

      if (res.ok) {
        toast.success("Author added ✨")
        setOpenAuthorModal(false)
        setNewAuthor({ name: "", email: "", avatar_url: "" })
        fetchAuthors()
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to add author")
      }
    } catch (err) {
      console.error("Error adding author:", err)
      toast.error("Error adding author")
    }
  }

  // ✅ Create Post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
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

  const handleInputChange = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

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
          {/* Main content */}
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
                  value={formData.seseo_title}
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

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* STATUS */}
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleInputChange("status", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-[250px] overflow-y-auto">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                {/* CATEGORY */}
                <div className="flex justify-between items-center">
                  <Label>Category *</Label>
                  <Dialog open={openCategoryModal} onOpenChange={setOpenCategoryModal}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-xs gap-1">
                        <Plus size={14} /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddCategory} className="space-y-3">
                        <Input
                          placeholder="Enter category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <Button type="submit" className="w-full">
                          Add Category
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Select
                  value={formData.category_id}
                  onValueChange={(v) => handleInputChange("category_id", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingCats ? "Loading..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-[250px] overflow-y-auto">
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        No categories available
                      </div>
                    )}
                  </SelectContent>
                </Select>

                {/* AUTHOR */}
                <div className="flex justify-between items-center">
                  <Label>Author *</Label>
                  <Dialog open={openAuthorModal} onOpenChange={setOpenAuthorModal}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-xs gap-1">
                        <Plus size={14} /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Add New Author</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddAuthor} className="space-y-3">
                        <Input
                          placeholder="Author name"
                          value={newAuthor.name}
                          onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                        />
                        <Input
                          placeholder="Author email"
                          value={newAuthor.email}
                          onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
                        />
                        <Input
                          placeholder="Avatar URL (optional)"
                          value={newAuthor.avatar_url}
                          onChange={(e) => setNewAuthor({ ...newAuthor, avatar_url: e.target.value })}
                        />
                        <Button type="submit" className="w-full">
                          Add Author
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Select
                  value={formData.author_id}
                  onValueChange={(v) => handleInputChange("author_id", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingAuthors ? "Loading..." : "Select author"} />
                  </SelectTrigger>
                  <SelectContent className="z-50 max-h-[250px] overflow-y-auto">
                    {authors.length > 0 ? (
                      authors.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        No authors available
                      </div>
                    )}
                  </SelectContent>
                </Select>

                {/* FEATURED */}
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(c) => handleInputChange("featured", c)}
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

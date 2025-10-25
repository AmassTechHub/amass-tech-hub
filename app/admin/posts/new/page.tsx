"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye } from "lucide-react"

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    image_url: "",
    tags: "",
    featured: false,
    published: false
  })

  const categories = [
    "Startup News",
    "Infrastructure", 
    "AI & Tech",
    "Security",
    "Fintech",
    "Cloud",
    "Reviews",
    "Tutorials",
    "Tools"
  ]

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create article')
      }

      const data = await response.json()
      router.push('/admin/posts')
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Failed to create article. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
            <p className="text-gray-600">Write and publish a new article</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>Basic information about your article</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="Brief description of the article"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="image_url">Featured Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="tech, africa, startup (comma separated)"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Write your article content</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Write your article content here..."
                  rows={15}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
              <CardDescription>Control how your article is published</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Featured Article</Label>
                  <p className="text-sm text-gray-600">Show this article prominently on the homepage</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleChange('featured', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published">Publish Now</Label>
                  <p className="text-sm text-gray-600">Make this article visible to readers</p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => handleChange('published', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Article'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/posts')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
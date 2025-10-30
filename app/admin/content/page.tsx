'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ContentEditor, type Content as BaseContent } from '@/components/admin/content-editor'

// ✅ Extend the Content type for admin page (adds DB fields)
type Content = BaseContent & {
  id: string
  created_at?: string
  updated_at?: string
}

export default function ContentManager() {
  const [content, setContent] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [contentTypeFilter, setContentTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showEditor, setShowEditor] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)

  const contentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'news', label: 'News' },
    { value: 'tutorial', label: 'Tutorials' },
    { value: 'tool', label: 'Tools' },
    { value: 'service', label: 'Services' },
    { value: 'podcast', label: 'Podcasts' },
    { value: 'event', label: 'Events' },
  ]

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ]

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/content')
      if (!response.ok) throw new Error('Failed to fetch content')

      const result = await response.json()
      const data = Array.isArray(result.data) ? result.data : result
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item: Content) => {
    setEditingContent(item)
    setShowEditor(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/content?id=${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete content')
        fetchContent()
      } catch (error) {
        console.error('Error deleting content:', error)
      }
    }
  }

  const handleEditorClose = (saved: boolean) => {
    setShowEditor(false)
    setEditingContent(null)
    if (saved) fetchContent()
  }

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = contentTypeFilter === 'all' || item.type === contentTypeFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Published</Badge>
      case 'draft':
        return <Badge variant="outline">Draft</Badge>
      case 'archived':
        return <Badge variant="destructive">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      news: 'News',
      tutorial: 'Tutorial',
      tool: 'Tool',
      service: 'Service',
      podcast: 'Podcast',
      event: 'Event',
    }
    return typeMap[type] || type
  }

  if (showEditor) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="outline" onClick={() => handleEditorClose(false)} className="mb-6">
          ← Back to Content
        </Button>
        <h1 className="text-3xl font-bold mb-6">
          {editingContent ? 'Edit Content' : 'Create New Content'}
        </h1>
        <ContentEditor
          content={editingContent}
          onSave={() => handleEditorClose(true)}
          onCancel={() => handleEditorClose(false)}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Manager</h1>
          <p className="text-muted-foreground">Manage all your website content in one place</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {contentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading content...
                </TableCell>
              </TableRow>
            ) : filteredContent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No content found. Create your first piece of content!
                </TableCell>
              </TableRow>
            ) : (
              filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getTypeLabel(item.type)}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    {item.isFeatured ? (
                      <Badge variant="outline">Featured</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/${item.type}s/${item.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

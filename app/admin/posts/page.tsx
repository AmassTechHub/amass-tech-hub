"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Eye } from "lucide-react"

const mockPosts = [
  {
    id: 1,
    title: "5G Networks Transforming African Tech Landscape",
    category: "News",
    status: "Published",
    views: 1240,
    date: "2025-01-15",
  },
  {
    id: 2,
    title: "Best AI Tools for Content Creators",
    category: "Reviews",
    status: "Published",
    views: 892,
    date: "2025-01-14",
  },
  {
    id: 3,
    title: "Getting Started with React 19",
    category: "Tutorials",
    status: "Draft",
    views: 0,
    date: "2025-01-13",
  },
  {
    id: 4,
    title: "Figma vs Adobe XD: Complete Comparison",
    category: "Reviews",
    status: "Published",
    views: 2150,
    date: "2025-01-12",
  },
]

export default function PostsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPosts = mockPosts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))

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

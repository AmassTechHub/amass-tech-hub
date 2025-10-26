"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, MessageSquare, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalArticles: number
  totalSubscribers: number
  totalContactSubmissions: number
  totalViews: number
  recentArticles: number
  recentSubscribers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalSubscribers: 0,
    totalContactSubmissions: 0,
    totalViews: 0,
    recentArticles: 0,
    recentSubscribers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [articlesRes, subscribersRes, contactRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/newsletter/subscribers'),
        fetch('/api/contact/submissions')
      ])

      const articles = articlesRes.ok ? await articlesRes.json() : { articles: [] }
      const subscribers = subscribersRes.ok ? await subscribersRes.json() : { subscribers: [] }
      const contact = contactRes.ok ? await contactRes.json() : { submissions: [] }

      const totalViews = articles.articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0)
      const recentArticles = articles.articles.filter((article: any) => {
        const createdAt = new Date(article.created_at)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return createdAt > thirtyDaysAgo
      }).length

      const recentSubscribers = subscribers.subscribers.filter((sub: any) => {
        const subscribedAt = new Date(sub.subscribed_at)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return subscribedAt > thirtyDaysAgo
      }).length

      setStats({
        totalArticles: articles.articles.length,
        totalSubscribers: subscribers.subscribers.length,
        totalContactSubmissions: contact.submissions.length,
        totalViews,
        recentArticles,
        recentSubscribers
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for charts (in a real app, you'd fetch this from analytics)
  const dashboardData = [
    { month: "Jan", posts: 12, views: 4000, subscribers: 240 },
    { month: "Feb", posts: 19, views: 3000, subscribers: 221 },
    { month: "Mar", posts: 15, views: 2000, subscribers: 229 },
    { month: "Apr", posts: 22, views: 2780, subscribers: 200 },
    { month: "May", posts: 18, views: 1890, subscribers: 250 },
    { month: "Jun", posts: 25, views: 2390, subscribers: 290 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your content overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">+{stats.recentArticles} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">+{stats.recentSubscribers} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContactSubmissions}</div>
            <p className="text-xs text-muted-foreground">Total messages received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all articles</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Posts & Views</CardTitle>
            <CardDescription>Monthly content performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#3c0a6b" />
                <Bar dataKey="views" fill="#d6a51b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscriber Growth</CardTitle>
            <CardDescription>Monthly subscriber trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="subscribers" stroke="#3c0a6b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

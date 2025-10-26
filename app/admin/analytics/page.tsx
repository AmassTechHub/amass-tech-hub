"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Share2, TrendingUp, Clock } from "lucide-react"

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [contentPerformance, setContentPerformance] = useState<any[]>([])
  const [engagementData, setEngagementData] = useState<any[]>(June)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/articles')
      if (response.ok) {
        const data = await response.json()
        const articles = data.articles || []
        
        // Get top performing articles
        const topArticles = articles
          .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((article: any, index: number) => ({
            id: article.id,
            title: article.title.length > 30 ? article.title.substring(0, 30) + '...' : article.title,
            views: article.views || 0,
            shares: Math.floor((article.views || 0) / 10),
            comments: 0 // Would come from comments table
          }))
        
        setContentPerformance(topArticles)
        
        // Weekly engagement (mock structure - replace with real analytics)
        setEngagementData([
          { day: "Mon", engagement: 0, shares: 0, comments: 0 },
          { day: "Tue", engagement: 0, shares: 0, comments: 0 },
          { day: "Wed", engagement: 0, shares: 0, comments: 0 },
          { day: "Thu", engagement: 0, shares: 0, comments: 0 },
          { day: "Fri", engagement: 0, shares: 0, comments: 0 },
          { day: "Sat", engagement: 0, shares: 0, comments: 0 },
          { day: "Sun", engagement: 0, shares: 0, comments: 0 },
        ])
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Performance insights and metrics</p>
      </div>

      {/* Content Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>Most viewed articles</CardDescription>
        </CardHeader>
        <CardContent>
          {contentPerformance.length > 0 ? (
            <div className="space-y-4">
              {contentPerformance.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {item.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 size={14} /> {item.shares}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No content data yet</p>
          )}
        </CardContent>
      </Card>

      {/* Engagement Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement</CardTitle>
            <CardDescription>Content engagement over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="engagement" fill="#3c0a6b" />
                <Bar dataKey="shares" fill="#d6a51b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
            <CardDescription>Weekly engagement patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="engagement" stroke="#3c0a6b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

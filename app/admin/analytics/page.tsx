"use client"

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

const contentPerformanceData = [
  { title: "AI in Africa", views: 4200, shares: 320, comments: 45 },
  { title: "Fintech Trends", views: 3800, shares: 280, comments: 38 },
  { title: "Cloud Security", views: 3200, shares: 210, comments: 28 },
  { title: "Startup Funding", views: 2900, shares: 180, comments: 22 },
  { title: "5G Networks", views: 2600, shares: 150, comments: 18 },
]

const engagementData = [
  { day: "Mon", engagement: 65, shares: 45, comments: 28 },
  { day: "Tue", engagement: 72, shares: 52, comments: 35 },
  { day: "Wed", engagement: 68, shares: 48, comments: 32 },
  { day: "Thu", engagement: 78, shares: 58, comments: 42 },
  { day: "Fri", engagement: 85, shares: 65, comments: 48 },
  { day: "Sat", engagement: 72, shares: 55, comments: 38 },
  { day: "Sun", engagement: 68, shares: 50, comments: 35 },
]

const contentTypeData = [
  { name: "News", value: 45, color: "#3c0a6b" },
  { name: "Tutorials", value: 25, color: "#d6a51b" },
  { name: "Reviews", value: 18, color: "#8b5cf6" },
  { name: "Tools", value: 12, color: "#ec4899" },
]

const abTestData = [
  { test: "Headline A vs B", variant_a: 2400, variant_b: 2800, winner: "B" },
  { test: "Image 1 vs 2", variant_a: 1800, variant_b: 2100, winner: "B" },
  { test: "CTA Button", variant_a: 1200, variant_b: 1450, winner: "B" },
]

export default function AnalyticsDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track content performance and reader engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5K</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Read Time</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2m</div>
            <p className="text-xs text-muted-foreground">+0.3m from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shares</CardTitle>
            <Share2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2K</div>
            <p className="text-xs text-muted-foreground">+18% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>Views, shares, and comments by article</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#3c0a6b" />
              <Bar dataKey="shares" fill="#d6a51b" />
              <Bar dataKey="comments" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement Trends</CardTitle>
            <CardDescription>Reader interaction metrics</CardDescription>
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
                <Line type="monotone" dataKey="shares" stroke="#d6a51b" strokeWidth={2} />
                <Line type="monotone" dataKey="comments" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Type Distribution</CardTitle>
            <CardDescription>Breakdown by content category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* A/B Testing Results */}
      <Card>
        <CardHeader>
          <CardTitle>A/B Testing Results</CardTitle>
          <CardDescription>Active and completed tests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {abTestData.map((test, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                <div>
                  <p className="font-medium text-foreground">{test.test}</p>
                  <p className="text-sm text-muted-foreground">
                    Variant A: {test.variant_a} | Variant B: {test.variant_b}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">
                    Winner: {test.winner}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Eye, Share2, MessageSquare, Clock } from "lucide-react"

const contentMetrics = [
  {
    id: 1,
    title: "AI in Africa: The Next Tech Revolution",
    views: 4200,
    shares: 320,
    comments: 45,
    readTime: 5.2,
    engagement: 85,
    trend: "+12%",
  },
  {
    id: 2,
    title: "Fintech Trends Shaping 2025",
    views: 3800,
    shares: 280,
    comments: 38,
    readTime: 4.8,
    engagement: 78,
    trend: "+8%",
  },
  {
    id: 3,
    title: "Cloud Security Best Practices",
    views: 3200,
    shares: 210,
    comments: 28,
    readTime: 6.1,
    engagement: 72,
    trend: "+5%",
  },
  {
    id: 4,
    title: "Startup Funding Guide for Africa",
    views: 2900,
    shares: 180,
    comments: 22,
    readTime: 7.3,
    engagement: 68,
    trend: "+3%",
  },
]

export default function ContentPerformance() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Performance</h1>
        <p className="text-muted-foreground">Detailed metrics for each article</p>
      </div>

      <div className="space-y-4">
        {contentMetrics.map((content) => (
          <Card key={content.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">{content.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {content.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" /> {content.shares} shares
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" /> {content.comments} comments
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {content.readTime}m read
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{content.engagement}%</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-accent">{content.trend}</p>
                    <p className="text-xs text-muted-foreground">vs last week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

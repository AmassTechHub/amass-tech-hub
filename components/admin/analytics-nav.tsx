import Link from "next/link"
import { BarChart3, TrendingUp } from "lucide-react"

export function AnalyticsNav() {
  return (
    <div className="flex gap-2 mb-6">
      <Link
        href="/admin/analytics"
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
      >
        <BarChart3 className="h-4 w-4" />
        Dashboard
      </Link>
      <Link href="/admin/content-performance" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted">
        <TrendingUp className="h-4 w-4" />
        Content Performance
      </Link>
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"

// Mock data for search
const mockContent = [
  {
    id: "1",
    title: "AI Revolution in African Tech",
    type: "article",
    excerpt: "Exploring how artificial intelligence is transforming the African tech landscape...",
    url: "/news/1",
    date: "2024-10-20",
  },
  {
    id: "2",
    title: "Figma Design Tool Review",
    type: "review",
    excerpt: "A comprehensive review of Figma for African designers and startups...",
    url: "/reviews/1",
    date: "2024-10-19",
  },
  {
    id: "3",
    title: "Getting Started with React",
    type: "tutorial",
    excerpt: "Learn React basics in this beginner-friendly tutorial...",
    url: "/tutorials/1",
    date: "2024-10-18",
  },
  {
    id: "4",
    title: "Slack - Team Communication",
    type: "tool",
    excerpt: "Slack is a powerful tool for team collaboration and communication...",
    url: "/tools/1",
    date: "2024-10-17",
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")?.toLowerCase() || ""

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const results = mockContent.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query),
  )

  return NextResponse.json({ results })
}

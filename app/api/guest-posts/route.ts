import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, content, category } = await request.json()

    if (!title || !excerpt || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // TODO: Save guest post to database for moderation
    const guestPost = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      excerpt,
      content,
      category,
      status: "pending",
      submittedAt: new Date(),
    }

    return NextResponse.json({ success: true, guestPost })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit guest post" }, { status: 500 })
  }
}

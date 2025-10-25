import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { articleId, content } = await request.json()

    if (!articleId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // TODO: Save comment to database
    const comment = {
      id: Math.random().toString(36).substr(2, 9),
      articleId,
      userId: "current-user-id",
      author: {
        id: "1",
        name: "User Name",
        email: "user@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        bio: "Tech enthusiast",
        role: "contributor" as const,
      },
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      replies: [],
    }

    return NextResponse.json(comment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 })
  }
}

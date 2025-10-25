import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // TODO: Integrate with your database/auth service
    // This is a mock implementation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    // Mock user response
    const user = {
      id: "1",
      email,
      name: email.split("@")[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      preferences: {
        theme: "light",
        newsletter: true,
        emailNotifications: true,
        followedAuthors: [],
        savedArticles: [],
        readingList: [],
        interests: [],
      },
      stats: {
        articlesRead: 0,
        articlesShared: 0,
        commentsPosted: 0,
        articlesSaved: 0,
        referralsCount: 0,
        membershipTier: "free",
        joinedAt: new Date(),
      },
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

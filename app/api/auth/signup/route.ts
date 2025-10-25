import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }

    // TODO: Integrate with your database/auth service
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
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
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"

// Mock database
const contactSubmissions: Array<{
  id: string
  name: string
  email: string
  subject: string
  message: string
  submittedAt: Date
}> = []

export async function GET(request: NextRequest) {
  // In production, add authentication to protect this endpoint
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    total: contactSubmissions.length,
    submissions: contactSubmissions.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()),
  })
}

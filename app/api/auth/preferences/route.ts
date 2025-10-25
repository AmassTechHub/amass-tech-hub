import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const preferences = await request.json()
    // TODO: Update user preferences in database
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // TODO: Get current user from session/token
  return NextResponse.json(null)
}

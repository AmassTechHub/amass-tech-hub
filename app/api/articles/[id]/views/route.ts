import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const articleId = params.id
  if (!articleId) {
    return NextResponse.json({ error: "Missing article ID" }, { status: 400 })
  }

  const { error } = await supabaseAdmin.rpc("increment_views", { article_id: articleId })

  if (error) {
    console.error("View increment error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

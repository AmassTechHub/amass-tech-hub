import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const article_id = url.searchParams.get("article_id")
  const status = url.searchParams.get("status") || "pending"
  const limit = Number(url.searchParams.get("limit") || 100)

  let q = supabaseAdmin.from("comments").select("*").order("created_at", { ascending: false }).limit(limit)
  if (article_id) q = q.eq("article_id", article_id)
  if (status !== "all") q = q.eq("status", status)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comments: data || [] })
}

export async function POST(req: Request) {
  try {
    const { article_id, author_name, author_email, content } = await req.json()
    if (!article_id || !content) return NextResponse.json({ error: "article_id and content required" }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert([{ article_id, author_name, author_email: author_email?.toLowerCase() || null, content, status: "pending" }])
      .select("*")
      .single()

    if (error) throw error
    return NextResponse.json({ comment: data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create comment" }, { status: 500 })
  }
}

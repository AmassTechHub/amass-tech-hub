import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// GET /api/comments?status=all|pending|approved|spam&search=&page=1&pageSize=20
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = (searchParams.get("status") || "all") as "all"|"pending"|"approved"|"spam"
  const search = (searchParams.get("search") || "").trim()
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 100)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabaseAdmin.from("comments").select("*", { count: "exact" }).order("created_at", { ascending: false })
  if (status !== "all") query = query.eq("status", status)
  if (search) query = query.ilike("content", `%${search}%`)

  const { data, error, count } = await query.range(from, to)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data, total: count ?? 0, page, pageSize })
}

// POST { article_id, author_name, author_email, content }
export async function POST(req: Request) {
  const { article_id, author_name, author_email, content } = await req.json().catch(() => ({}))
  if (!article_id || !content) return NextResponse.json({ error: "article_id and content required" }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("comments").insert({ article_id, author_name, author_email, content }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ item: data }, { status: 201 })
}

// PATCH { id, status }  (approve/spam)
export async function PATCH(req: Request) {
  const { id, status } = await req.json().catch(() => ({}))
  if (!id || !["pending","approved","spam"].includes(status)) {
    return NextResponse.json({ error: "id and valid status required" }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin.from("comments").update({ status }).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ item: data })
}

// DELETE /api/comments?id=...
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { error } = await supabaseAdmin.from("comments").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

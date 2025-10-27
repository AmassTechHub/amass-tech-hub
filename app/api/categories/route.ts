import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// GET /api/categories?search=&page=1&pageSize=20
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = (searchParams.get("search") || "").trim()
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 100)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabaseAdmin.from("categories").select("*", { count: "exact" }).order("created_at", { ascending: false })
  if (search) query = query.ilike("name", `%${search}%`)

  const { data, error, count } = await query.range(from, to)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data, total: count ?? 0, page, pageSize })
}

// POST { name, slug, description }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { name, slug, description } = body || {}
  if (!name || !slug) return NextResponse.json({ error: "name and slug required" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({ name, slug, description })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ item: data }, { status: 201 })
}

// PATCH { id, name?, slug?, description? }
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { id, ...updates } = body || {}
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { data, error } = await supabaseAdmin.from("categories").update(updates).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ item: data })
}

// DELETE /api/categories?id=...
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

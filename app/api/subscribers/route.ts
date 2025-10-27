import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = (searchParams.get("search") || "").trim()
  const page = Number(searchParams.get("page") || 1)
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 100)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabaseAdmin.from("subscribers").select("*", { count: "exact" }).order("created_at", { ascending: false })
  if (search) query = query.ilike("email", `%${search}%`)

  const { data, error, count } = await query.range(from, to)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data, total: count ?? 0, page, pageSize })
}

export async function POST(req: Request) {
  const { email, source } = await req.json().catch(() => ({}))
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })
  const { data, error } = await supabaseAdmin.from("subscribers").insert({ email, source: source || "admin" }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ item: data }, { status: 201 })
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json().catch(() => ({}))
  if (!id || !["subscribed","unsubscribed"].includes(status)) {
    return NextResponse.json({ error: "id and valid status required" }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin.from("subscribers").update({ status }).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ item: data })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { error } = await supabaseAdmin.from("subscribers").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

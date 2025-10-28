import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get("q") || ""
  const limit = Number(url.searchParams.get("limit") || 50)

  const base = supabaseAdmin.from("subscribers").select("*").order("created_at", { ascending: false }).limit(limit)
  const query = q ? base.ilike("email", `%${q}%`) : base

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ subscribers: data || [] })
}

export async function POST(req: Request) {
  try {
    const { email, name, source } = await req.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from("subscribers")
      .insert([{ email: email.toLowerCase().trim(), name: name?.trim() || null, source: source || null }])
      .select("*")
      .single()

    if (error) throw error
    return NextResponse.json({ subscriber: data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to subscribe" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { error } = await supabaseAdmin.from("subscribers").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

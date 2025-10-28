import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await _req.json()
  const { status } = body // 'approved' | 'rejected' | 'spam' | 'pending'

  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("comments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ comment: data })
}

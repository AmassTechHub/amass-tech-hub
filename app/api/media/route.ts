import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// GET all files in bucket
export async function GET() {
  const { data, error } = await supabaseAdmin.storage.from("media").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get public URLs for each file
  const files = data.map((file) => ({
    name: file.name,
    url: supabaseAdmin.storage.from("media").getPublicUrl(file.name).data.publicUrl,
    created_at: file.created_at,
  }))
  return NextResponse.json(files)
}

// DELETE a file
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name")
  if (!name) return NextResponse.json({ error: "File name required" }, { status: 400 })

  const { error } = await supabaseAdmin.storage.from("media").remove([name])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

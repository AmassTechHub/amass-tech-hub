import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// ✅ GET all files in the "media" bucket
export async function GET() {
  try {
    // Supabase storage only allows sorting by "name"
    const { data, error } = await supabaseAdmin.storage
      .from("media")
      .list("", { limit: 100, sortBy: { column: "name", order: "desc" } })

    if (error) {
      console.error("❌ Supabase list error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Map file info to public URLs
    const files =
      data?.map((file) => ({
        name: file.name,
        url: supabaseAdmin.storage.from("media").getPublicUrl(file.name).data.publicUrl,
        updated_at: file.updated_at || null,
        size: file.metadata?.size || 0,
      })) || []

    return NextResponse.json(files)
  } catch (err: any) {
    console.error("❌ Unexpected /api/media error:", err)
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 })
  }
}

// ✅ DELETE a file by name
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json({ error: "File name required" }, { status: 400 })
  }

  const { error } = await supabaseAdmin.storage.from("media").remove([name])
  if (error) {
    console.error("❌ Delete error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

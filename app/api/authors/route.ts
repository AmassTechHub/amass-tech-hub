import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// ✅ Get all authors
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("authors")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ authors: data || [] })
  } catch (error: any) {
    console.error("Error fetching authors:", error.message)
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 })
  }
}

// ✅ Add a new author (optional for admin)
export async function POST(req: Request) {
  try {
    const { name, email, avatar_url } = await req.json()

    const { data, error } = await supabaseAdmin
      .from("authors")
      .insert([{ name, email, avatar_url }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ author: data })
  } catch (error: any) {
    console.error("Error creating author:", error.message)
    return NextResponse.json({ error: "Failed to create author" }, { status: 500 })
  }
}

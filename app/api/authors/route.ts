import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// ✅ Fetch all authors
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

// ✅ Create a new author
export async function POST(req: Request) {
  try {
    const { name, email, avatar_url } = await req.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Both name and email are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("authors")
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          avatar_url: avatar_url || null,
        },
      ])
      .select("*")
      .single()

    if (error) throw error

    return NextResponse.json({ author: data }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating author:", error.message)
    return NextResponse.json(
      { error: "Failed to create author" },
      { status: 500 }
    )
  }
}

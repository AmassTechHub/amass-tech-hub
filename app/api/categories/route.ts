import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// ✅ Get all categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ categories: data || [] })
  } catch (error: any) {
    console.error("Error fetching categories:", error.message)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// ✅ Add a new category (optional for admin)
export async function POST(req: Request) {
  try {
    const { name, color } = await req.json()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([{ name, slug, color }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ category: data })
  } catch (error: any) {
    console.error("Error creating category:", error.message)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

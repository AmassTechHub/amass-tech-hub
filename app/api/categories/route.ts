import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// ✅ Fetch all categories
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

// ✅ Create new category
export async function POST(req: Request) {
  try {
    const { name, color } = await req.json()

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert([{ name, slug, color: color || "#3c0a6b" }])
      .select("*")
      .single()

    if (error) throw error

    return NextResponse.json({ category: data }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating category:", error.message)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

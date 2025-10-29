// ✅ PATCH update existing article
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      title,
      content,
      excerpt,
      category_id,
      author_id,
      featured_image,
      tags,
      featured,
      status,
      seo_title,
      seo_description,
    } = body

    // Validate UUIDs
    if (!id) {
      return NextResponse.json({ error: "Missing article ID." }, { status: 400 })
    }
    if (!category_id || !author_id) {
      return NextResponse.json(
        { error: "You must select both a category and an author." },
        { status: 400 }
      )
    }

    // Generate slug and reading time
    const slug = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : undefined

    const wordCount = content?.split(/\s+/).length || 0
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(content && { content }),
      ...(excerpt && { excerpt }),
      category_id,
      author_id,
      featured_image: featured_image || null,
      tags: tags || [],
      featured: !!featured,
      status: status || "draft",
      reading_time,
      seo_title: seo_title || title,
      seo_description: seo_description || excerpt,
      published_at: status === "published" ? new Date().toISOString() : null,
    }

    const { data, error } = await supabaseAdmin
      .from("articles")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        featured,
        status,
        views,
        created_at,
        published_at,
        reading_time,
        seo_title,
        seo_description,
        featured_image,
        categories:category_id ( id, name, slug, color ),
        authors:author_id ( id, name, email, avatar_url )
        `
      )
      .single()

    if (error) {
      console.error("Update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ article: data }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const contentSchema = z.object({
  type: z.enum(["news", "tutorial", "tool", "service", "podcast", "event"]).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  isFeatured: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // <- await the params
  try {
    const body = await request.json();
    const validatedData = contentSchema.parse(body);

    const { data: existing } = await supabase
      .from("content")
      .select("status")
      .eq("id", id)
      .single();

    const updateData = {
      ...validatedData,
      updated_at: new Date().toISOString(),
      ...(validatedData.status === "published" &&
        existing?.status !== "published" && {
          published_at: new Date().toISOString(),
        }),
    };

    const { data, error } = await supabase
      .from("content")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const { error } = await supabase.from("content").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

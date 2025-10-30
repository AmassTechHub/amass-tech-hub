import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '../utils/auth';

export async function GET() {
  const supabase = createServerClient();
  
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('faqs')
      .insert({
        ...body,
        order_index: body.order_index || 0
      } as any)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

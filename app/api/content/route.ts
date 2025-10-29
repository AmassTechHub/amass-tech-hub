import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase configuration');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Schema validation
const contentSchema = z.object({
  type: z.enum(['news', 'tutorial', 'tool', 'service', 'podcast', 'event']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().url('Invalid URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
};

// Helper function to handle errors
const handleError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  return NextResponse.json(
    { error: message, details: error.message },
    { status: 500 }
  );
};

// GET: Fetch all content or filter by type/status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const isFeatured = searchParams.get('isFeatured');

    let query = supabase
      .from('content')
      .select('*', { count: 'exact' });

    // Apply filters
    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);
    if (isFeatured) query = query.eq('is_featured', isFeatured === 'true');

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Sort by created_at by default
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: {
        total: count,
        limit,
        offset,
      },
    });
  } catch (error: any) {
    return handleError(error, 'Failed to fetch content');
  }
}

// POST: Create new content
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...contentData } = body;

    // Validate request body
    if (!type) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      );
    }

    // Validate content data
    const validatedData = contentSchema.parse({
      ...contentData,
      type,
    });

    // Prepare content for database
    const contentToCreate = {
      ...validatedData,
      slug: generateSlug(validatedData.title),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Set published_at if status is published
      ...(validatedData.status === 'published' && { published_at: new Date().toISOString() }),
    };

    // Insert into database
    const { data: result, error } = await supabase
      .from('content')
      .insert([contentToCreate])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return handleError(error, 'Failed to create content');
  }
}

// PUT: Update content by ID
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, ...updateData } = body;

    // Get existing content to check for status changes
    const { data: existingContent, error: fetchError } = await supabase
      .from('content')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Validate update data
    const validatedData = contentSchema.partial().parse(updateData);

    // Prepare update payload
    const contentToUpdate = {
      ...validatedData,
      // Update slug if title changed
      ...(updateData.title && { slug: generateSlug(updateData.title) }),
      updated_at: new Date().toISOString(),
      // Update published_at if status changed to published
      ...(updateData.status === 'published' && existingContent?.status !== 'published' && {
        published_at: new Date().toISOString(),
      }),
    };

    // Update in database
    const { data: result, error } = await supabase
      .from('content')
      .update(contentToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return handleError(error, 'Failed to update content');
  }
}

// DELETE: Delete content by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    // First, get the content to return it in the response
    const { data: content, error: fetchError } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Then delete it
    const { error: deleteError } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
      data: content,
    });
  } catch (error) {
    return handleError(error, 'Failed to delete content');
  }
}

// PATCH: Publish/Unpublish content
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (!id || !action) {
      return NextResponse.json(
        { error: 'Content ID and action are required' },
        { status: 400 }
      );
    }

    if (!['publish', 'unpublish', 'archive'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be publish, unpublish, or archive' },
        { status: 400 }
      );
    }

    const statusMap: Record<string, 'published' | 'draft' | 'archived'> = {
      publish: 'published',
      unpublish: 'draft',
      archive: 'archived',
    };

    const updateData = {
      status: statusMap[action],
      updated_at: new Date().toISOString(),
      ...(action === 'publish' && { published_at: new Date().toISOString() }),
    };

    const { data: result, error } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Content ${action}ed successfully`,
      data: result,
    });
  } catch (error) {
    return handleError(error, 'Failed to update content status');
  }
}

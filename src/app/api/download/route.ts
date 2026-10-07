import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resourceId, resourceTitle, resourceCategory, coverImageUrl, isFree } = body;

    if (!resourceTitle || !resourceCategory) {
      return NextResponse.json(
        { error: 'Resource title and category are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('download_history')
      .insert({
        user_id: user.id,
        resource_id: resourceId || null,
        resource_title: resourceTitle,
        resource_category: resourceCategory,
        cover_image_url: coverImageUrl || null,
        is_free: isFree ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Increment download count on resource if it exists
    if (resourceId) {
      await supabase.rpc('increment_download_count', { resource_id: resourceId });
    }

    return NextResponse.json({ download: data });
  } catch (error) {
    console.error('Download record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

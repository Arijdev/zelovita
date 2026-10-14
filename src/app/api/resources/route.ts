import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isFree = searchParams.get('isFree');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('health_resources')
      .select('*')
      .eq('is_active', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (isFree !== null) {
      query = query.eq('is_free', isFree === 'true');
    }

    const { data, error, count } = await query;

    if (error) {
      console.warn('Supabase health_resources table query notice:', error.message);
      return NextResponse.json({ resources: [], total: 0 });
    }

    return NextResponse.json({ resources: data || [], total: count || 0 });
  } catch (error) {
    console.error('Resources fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'doctor') {
      return NextResponse.json({ error: 'Forbidden: Doctors only' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      category,
      is_free,
      price,
      original_price,
      cover_image_url,
      pdf_url,
      thumbnail_url,
      badge,
      badge_color,
      description,
      highlights,
      table_of_contents,
      full_content,
    } = body;

    const { data, error } = await supabase
      .from('health_resources')
      .insert({
        title,
        subtitle,
        category,
        is_free: is_free ?? false,
        price: price ?? 0,
        original_price,
        cover_image_url,
        pdf_url,
        thumbnail_url,
        badge,
        badge_color: badge_color || 'emerald',
        description,
        highlights: highlights || [],
        table_of_contents: table_of_contents || [],
        full_content: full_content || {},
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ resource: data });
  } catch (error) {
    console.error('Resource creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

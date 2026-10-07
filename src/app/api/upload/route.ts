import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { generateThumbnail } from '@/lib/pdf-thumbnail';

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

    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const isFree = formData.get('isFree') === 'true';
    const price = parseFloat(formData.get('price') as string) || 0;
    const description = formData.get('description') as string;

    if (!pdfFile || !title || !category) {
      return NextResponse.json(
        { error: 'PDF file, title, and category are required' },
        { status: 400 }
      );
    }

    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();
    const timestamp = Date.now();
    const pdfFileName = `${user.id}/${timestamp}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const { data: pdfData, error: pdfError } = await adminClient.storage
      .from('pdfs')
      .upload(pdfFileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (pdfError) {
      return NextResponse.json({ error: pdfError.message }, { status: 400 });
    }

    const { data: pdfUrlData } = adminClient.storage.from('pdfs').getPublicUrl(pdfData.path);
    const pdfUrl = pdfUrlData.publicUrl;

    let thumbnailUrl: string | null = null;

    if (thumbnailFile) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(thumbnailFile.type)) {
        return NextResponse.json({ error: 'Thumbnail must be an image' }, { status: 400 });
      }

      const thumbnailFileName = `${user.id}/${timestamp}-thumb-${thumbnailFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());

      const { data: thumbData, error: thumbError } = await adminClient.storage
        .from('thumbnails')
        .upload(thumbnailFileName, thumbnailBuffer, {
          contentType: thumbnailFile.type,
          upsert: false,
        });

      if (thumbError) {
        return NextResponse.json({ error: thumbError.message }, { status: 400 });
      }

      const { data: thumbUrlData } = adminClient.storage.from('thumbnails').getPublicUrl(thumbData.path);
      thumbnailUrl = thumbUrlData.publicUrl;
    } else {
      try {
        const generatedThumbnail = await generateThumbnail(pdfBuffer);
        if (generatedThumbnail) {
          const thumbnailFileName = `${user.id}/${timestamp}-thumb-generated.png`;
          const { data: thumbData, error: thumbError } = await adminClient.storage
            .from('thumbnails')
            .upload(thumbnailFileName, generatedThumbnail, {
              contentType: 'image/png',
              upsert: false,
            });

          if (!thumbError && thumbData) {
            const { data: thumbUrlData } = adminClient.storage.from('thumbnails').getPublicUrl(thumbData.path);
            thumbnailUrl = thumbUrlData.publicUrl;
          }
        }
      } catch (thumbError) {
        console.error('Thumbnail generation failed:', thumbError);
      }
    }

    const { data: resource, error: resourceError } = await supabase
      .from('health_resources')
      .insert({
        title,
        category,
        is_free: isFree,
        price,
        cover_image_url: thumbnailUrl,
        pdf_url: pdfUrl,
        thumbnail_url: thumbnailUrl,
        description,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (resourceError) {
      await adminClient.storage.from('pdfs').remove([pdfData.path]);
      if (thumbnailUrl) {
        const thumbPath = thumbnailUrl.split('/thumbnails/')[1];
        if (thumbPath) {
          await adminClient.storage.from('thumbnails').remove([thumbPath]);
        }
      }
      return NextResponse.json({ error: resourceError.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'PDF uploaded successfully',
      resource,
      pdfUrl,
      thumbnailUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

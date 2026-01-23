
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, content, is_default } = body;

  // 1. is_default가 켜졌다면, 다른 프롬프트들의 default를 끈다.
  if (is_default) {
    const { error: resetError } = await supabase
      .from('prompts')
      .update({ is_default: false })
      .neq('id', id) // 자기 자신 제외 (어차피 아래에서 true로 덮어씀)
      .eq('is_default', true);

    if (resetError) {
      console.error('Reset default error:', resetError);
    }
  }

  // 2. 업데이트 수행
  const { data, error } = await supabase
    .from('prompts')
    .update({ 
        title, 
        content, 
        is_default 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Deleted successfully' });
}

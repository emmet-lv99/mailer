
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { title, content, is_default, type } = body;
  const promptType = type || 'YOUTUBE'; // Fallback or read from existing?

  // 1. 만약 이번 수정으로 is_default=true가 된다면
  // 다른 모든 녀석을 false로 (같은 타입 내에서)
  if (is_default) {
    // 타입이 필요함. 만약 body에 type이 안오면?
    // 안전을 위해 업데이트 대상의 type을 먼저 조회하는 게 좋지만, 
    // UI에서 type을 보내준다고 가정.
    // 만약 type이 없으면 기존 로직(전체)은 위험하므로, type이 있을 때만 실행하거나
    // 업데이트 치고 나서 트리거로 해야 하나?
    // 여기서는 간단히 type을 신뢰.
    
    // 하지만 기존 업데이트 로직에서는 type을 안 보낼 수도 있음.
    // 그래서 안전하게 해당 ID의 row를 먼저 읽는 것이 좋음.
    const { data: currentPrompt } = await supabase.from('prompts').select('prompt_type').eq('id', id).single();
    const targetType = type || currentPrompt?.prompt_type || 'YOUTUBE';

    await supabase
      .from('prompts')
      .update({ is_default: false })
      .eq('is_default', true)
      .eq('prompt_type', targetType);
  }

  // 2. 업데이트 수행
  const { data, error } = await supabase
    .from('prompts')
    .update({ title, content, is_default })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

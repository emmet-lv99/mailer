
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'YOUTUBE'; // Defaul to YOUTUBE for backward compatibility

  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('prompt_type', type)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content, is_default, type } = body;
  const promptType = type || 'YOUTUBE';

  // 1. 만약 이번에 생성하는 프롬프트가 '기본값(Default)'이라면,
  // 해당 타입의 기존 is_default=true 인 녀석들을 모두 false로 초기화해줘야 함.
  if (is_default) {
    await supabase
      .from('prompts')
      .update({ is_default: false })
      .eq('is_default', true)
      .eq('prompt_type', promptType);
  }

  // 2. 새 프롬프트 생성
  const { data, error } = await supabase
    .from('prompts')
    .insert([
      { 
        title, 
        content, 
        is_default: is_default || false,
        prompt_type: promptType
      }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}


import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  let query = supabase.from('settings').select('*');
  
  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Convert array to object for easier consumption { key: value }
  // Or return array if metadata is needed. Returning array is more flexible.
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { key, value, description, type } = body;

  if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('settings')
    .upsert([
      { 
        key, 
        value, 
        description, 
        type: type || 'GLOBAL', 
        updated_at: new Date().toISOString() 
      }
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

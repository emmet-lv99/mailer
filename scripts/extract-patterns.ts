import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Check .env.local');
  process.exit(1);
}

// Initialize Supabase Admin Client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function extractPatterns() {
  console.log('🔍 Starting Pattern Extraction...');

  try {
    // 1. Fetch recent analysis history (last 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    
    // Check if we have enough data
    const { count } = await supabase
        .from('analysis_history')
        .select('*', { count: 'exact', head: true })
        .gte('analyzed_at', ninetyDaysAgo);

    if ((count || 0) < 50) {
        console.log(`⚠️ 데이터 부족: 현재 ${count}건 (최소 50건 필요). 패턴 추출을 건너뜁니다.`);
        return;
    }

    // Fetch actual data (limit 500 for pattern analysis)
    const { data: analyses, error } = await supabase
      .from('analysis_history')
      .select('er, tier, purchase_keyword_ratio, analyzed_at')
      .gte('analyzed_at', ninetyDaysAgo)
      .limit(500);

    if (error) throw error;
    if (!analyses || analyses.length === 0) return;

    console.log(`📊 Analyzing ${analyses.length} records...`);

    // --- Pattern 1: ER Range Analysis ---
    const erRanges = [
      { min: 3.0, max: 999.0, name: 'ER 3.0% 이상' }, // Adjusted upper bound
      { min: 2.0, max: 3.0, name: 'ER 2.0-3.0%' },
      { min: 1.0, max: 2.0, name: 'ER 1.0-2.0%' }
    ];

    for (const range of erRanges) {
      const inRange = analyses.filter((a: any) => 
        (a.er || 0) >= range.min && (a.er || 0) < range.max
      );

      console.log(`[ER Analysis] Range: ${range.name}, Count: ${inRange.length}`);

      if (inRange.length < 5) {
          console.log(`   -> ⚠️ 표본 부족 (최소 5개 필요, 현재 ${inRange.length}개)`);
          continue; 
      }

      // Count 'S' or 'A' tiers
      const successCount = inRange.filter((a: any) => 
        a.tier === 'S' || a.tier === 'A'
      ).length;

      const confidence = (successCount / inRange.length) * 100;

      console.log(`   -> 👉 Success Rate: ${confidence.toFixed(1)}% (${successCount}/${inRange.length})`);

      const { error: upsertError } = await supabase
        .from('learned_patterns')
        .upsert({
          pattern_type: 'er_range',
          condition: range.name,
          outcome: 'A급 이상',
          confidence: parseFloat(confidence.toFixed(1)),
          sample_size: inRange.length,
          updated_at: new Date().toISOString()
        }, { onConflict: 'pattern_type, condition' });

      if (upsertError) console.error(`Failed to save pattern ${range.name}:`, upsertError);
    }

    // --- Pattern 2: Purchase Keyword Ratio Analysis ---
    const highKeywordGroup = analyses.filter((a: any) => 
      (a.purchase_keyword_ratio || 0) >= 40
    );

    if (highKeywordGroup.length >= 5) { // Lowered threshold slightly for testing
       const sTierCount = highKeywordGroup.filter((a: any) => a.tier === 'S').length;
       const confidence = (sTierCount / highKeywordGroup.length) * 100;

       console.log(`👉 [Keywords >= 40%] Sample: ${highKeywordGroup.length}, S-Tier: ${sTierCount} (${confidence.toFixed(1)}%)`);

       const { error: upsertError } = await supabase
        .from('learned_patterns')
        .upsert({
          pattern_type: 'keyword_ratio',
          condition: '구매 키워드 40% 이상',
          outcome: 'S급',
          confidence: parseFloat(confidence.toFixed(1)),
          sample_size: highKeywordGroup.length,
          updated_at: new Date().toISOString()
        }, { onConflict: 'pattern_type, condition' });
        
        if (upsertError) console.error(`Failed to save keyword pattern:`, upsertError);
    }

    console.log('✅ 패턴 추출 및 저장 완료');

  } catch (err) {
    console.error('❌ 패턴 추출 중 오류 발생:', err);
    process.exit(1);
  }
}

extractPatterns();

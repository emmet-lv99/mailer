import { supabase } from "@/lib/supabase";

/**
 * Fetches high-confidence learned patterns from the DB and appends them to the system prompt.
 * This effectively gives the AI "prior knowledge" based on past analysis success/failure.
 */
export async function augmentPromptWithPatterns(systemPrompt: string): Promise<string> {
  try {
    const { data: patterns, error } = await supabase
        .from('learned_patterns')
        .select('*')
        .gte('confidence', 70) // Only trust patterns with >= 70% confidence
        .order('confidence', { ascending: false })
        .limit(5);

    if (error) {
        console.warn("[Pattern] Failed to fetch patterns:", error);
        return systemPrompt;
    }

    if (!patterns || patterns.length === 0) {
        return systemPrompt;
    }

    const patternText = patterns.map(p => 
        `- ${p.condition}: ${p.confidence}% 확률로 ${p.outcome} (${p.sample_size}건 기반)`
    ).join('\n');

    const augmentedPrompt = `
${systemPrompt}

## 🧠 학습된 데이터 패턴 (Internal Knowledge)
다음은 우리 시스템의 과거 분석 데이터에서 추출된 신뢰할 수 있는 패턴입니다. 
분석 시 이 기준을 참고하되, 계정의 고유한 맥락을 우선시하세요.

${patternText}
`;

    return augmentedPrompt;

  } catch (e) {
    console.error("[Pattern] Exception during prompt augmentation:", e);
    return systemPrompt; // Fallback to original prompt on error
  }
}

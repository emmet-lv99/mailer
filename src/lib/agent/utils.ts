import { DualRoleAnalysis } from "./types";

export const extractJSON = (text: string): any | null => {
    try {
        // 1. Try generic JSON.parse first
        return JSON.parse(text);
    } catch {
        // 2. Try to find code blocks
        const codeBlockRegex = /```json\s*(\{[\s\S]*?\})\s*```/;
        const match = text.match(codeBlockRegex);
        if (match && match[1]) {
            try { return JSON.parse(match[1]); } catch {}
        }
        
        // 3. Try finding first { and last }
        const firstBrace = text.indexOf("{");
        const lastBrace = text.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            try {
                return JSON.parse(text.substring(firstBrace, lastBrace + 1));
            } catch {}
        }
        return null;
    }
};

export const parseAgentResponse = (content: string) => {
    let analysis: DualRoleAnalysis | undefined;
    let profileData: any;
    let errorData: any;
    let textContent = content;

    const parsed = extractJSON(content);
    
    if (parsed) {
        if (parsed.investmentAnalyst && parsed.influencerExpert) {
            analysis = parsed as DualRoleAnalysis;
            textContent = "Dual-Role 분석이 완료되었습니다. 아래 상세 리포트를 확인해주세요.";
        }
        if (parsed.foundProfile) {
            profileData = parsed.foundProfile;
            // Clean up: Remove the JSON block from the text to show only friendly message
            textContent = textContent.replace(/```json\s*\{[\s\S]*?\}\s*```/g, "")
                                .replace(/\{[\s\S]*"foundProfile"[\s\S]*\}/g, "") // Aggressive fallback cleanup
                                .trim();
            
            if (!textContent) {
                textContent = "프로필을 찾았습니다. 이 계정이 맞나요? 분석을 진행할까요?";
            }
        }
        // [NEW] Error Data Parsing
        if (parsed.error && parsed.error.code) {
            errorData = parsed.error;
            textContent = "분석 중 오류가 발생했습니다."; 
        }
    }

    return {
        content: textContent,
        analysis,
        profileData,
        errorData
    };
};

"use client";

export const BADGE_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
    'MARKET_UNSUITABLE': {
        title: "시장성 부족 (Market Unsuitable)",
        description: "팔로워 대비 평균 좋아요/댓글 수치(ER)가 현저히 낮거나, 최근 게시물 활동이 저조하여 마케팅 효과를 기대하기 어려운 계정입니다."
    },
    'QUALIFICATION_UNMET': {
        title: "자격 요건 미달 (Criteria Unmet)",
        description: "안목 투자가 설정한 최소 인플루언서 자격 요건(팔로워 1,000명 이상, 최근 7일 내 게시물, 주 1회 이상 업로드)을 충족하지 못했습니다."
    },
    'FAKE_SUSPECTED': {
        title: "가짜 의심 (Fake Suspected)",
        description: "갑작스런 팔로워 급증, 댓글 패턴의 부자연스러움, 봇 계정의 대량 유입 등이 감지되었습니다. 실제 영향력이 부풀려졌을 가능성이 높습니다."
    },
    'HIGH_TRUST': {
        title: "높은 신뢰도 (High Authenticity)",
        description: "댓글의 질, 팔로워의 활동성, 꾸준한 소통 비율이 매우 우수합니다. 진성 팬덤을 보유하고 있어 캠페인 진행 시 긍정적인 반응이 예상됩니다."
    },
    'CAMPAIGN_FIT': {
        title: "캠페인 적합도 분석 (Campaign Fit)",
        description: "현재 진행 중인 브랜드 캠페인의 타겟 오디언스, 브랜드 톤앤매너, 카테고리(패션/뷰티 등)와의 일치도를 AI가 종합적으로 판단한 결과입니다."
    }
};

export const getTierColor = (tier: string) => {
    switch (tier) {
        case 'S': return 'text-blue-600 border-blue-200 bg-blue-50';
        case 'A': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
        case 'B': return 'text-amber-600 border-amber-200 bg-amber-50';
        case 'C': return 'text-orange-600 border-orange-200 bg-orange-50';
        case 'D': return 'text-red-600 border-red-200 bg-red-50';
        default: return 'text-slate-600 border-slate-200 bg-slate-50';
    }
};

export const getGradeColor = (grade: string) => {
    switch (grade) {
        case 'Star': return 'text-purple-600 border-purple-200 bg-purple-50';
        case 'Rising': return 'text-indigo-600 border-indigo-200 bg-indigo-50';
        case 'Potential': return 'text-blue-600 border-blue-200 bg-blue-50';
        case 'Stagnant': return 'text-slate-600 border-slate-200 bg-slate-50';
        case 'Declining': return 'text-rose-600 border-rose-200 bg-rose-50';
        default: return 'text-slate-600 border-slate-200 bg-slate-50';
    }
};

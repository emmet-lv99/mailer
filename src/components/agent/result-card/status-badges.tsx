"use client";

import { Badge } from "@/components/ui/badge";
import { DualRoleAnalysis } from "@/lib/agent/types";

interface StatusBadgesProps {
    analysis: DualRoleAnalysis;
    onBadgeClick: (badgeKey: string) => void;
}

export function StatusBadges({ analysis, onBadgeClick }: StatusBadgesProps) {
    const { investmentAnalyst: investment } = analysis;

    return (
        <div className="flex gap-2">
            {/* Tier Badge */}
            <Badge variant="outline" className={`text-[10px] font-bold uppercase border-slate-200 cursor-default`}>
                {investment.decision}
            </Badge>

            {/* Market Suitability Badge */}
            {analysis.badges && !analysis.badges.isMarketSuitable && (
                <Badge 
                    className="bg-red-100 text-red-600 hover:bg-red-200 border-none text-[10px] cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onBadgeClick('MARKET_UNSUITABLE')}
                >
                    시장성 부족
                </Badge>
            )}

            {/* Qualification Criteria Badge */}
            {analysis.badges?.criteria && !analysis.badges.criteria.isMet && (
                <Badge 
                    className="bg-slate-800 text-white hover:bg-slate-700 border-none text-[10px] cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onBadgeClick('QUALIFICATION_UNMET')}
                >
                    자격 미달
                </Badge>
            )}

            {/* Authenticity Badge */}
            {analysis.badges && (
                analysis.badges.authenticity?.isFake ? (
                    <Badge 
                        className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none text-[10px] cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => onBadgeClick('FAKE_SUSPECTED')}
                    >
                        가짜 의심
                    </Badge>
                ) : (
                    <Badge 
                        className="bg-green-50 text-green-700 hover:bg-green-100 border-none text-[10px] cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => onBadgeClick('HIGH_TRUST')}
                    >
                        신뢰도 {analysis.badges.authenticity?.authenticityScore}
                    </Badge>
                )
            )}

            {/* Campaign Suitability Badge */}
            {analysis.badges && (
                <Badge 
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-none text-[10px] cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onBadgeClick('CAMPAIGN_FIT')}
                >
                    캠페인 적합도 분석
                </Badge>
            )}
        </div>
    );
}

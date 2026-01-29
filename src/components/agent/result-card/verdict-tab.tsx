"use client";

import { ComparisonSummary } from "@/lib/agent/types";
import { TrendingUp } from "lucide-react";

interface VerdictTabProps {
    comparison: ComparisonSummary;
}

export function VerdictTab({ comparison }: VerdictTabProps) {
    return (
        <div className="p-6 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:ring-0">
            <div className={`p-4 rounded-lg border ${comparison.agreement ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="font-bold text-sm mb-2 flex items-center gap-2">
                    {comparison.agreement ? (
                        <span className="text-emerald-700">⚖️ 종합 의견 일치</span>
                    ) : (
                        <span className="text-amber-700">⚖️ 종합 의견 분분 (쟁점 확인)</span>
                    )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                    {comparison.keyDifference}
                </p>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" /> 최종 종합 추천 사항
                </h4>
                <div className="p-6 bg-slate-900 text-slate-100 rounded-xl shadow-inner leading-relaxed text-sm text-center border-t-4 border-indigo-500">
                    "{comparison.recommendation}"
                </div>
            </div>
        </div>
    );
}

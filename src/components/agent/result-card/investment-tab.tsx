"use client";

import { InvestmentAnalyst } from "@/lib/agent/types";
import { AlertTriangle, Check, X } from "lucide-react";
import { getTierColor } from "./utils";

interface InvestmentTabProps {
    investment: InvestmentAnalyst;
}

export function InvestmentTab({ investment }: InvestmentTabProps) {
    return (
        <div className="p-6 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:ring-0">
            {/* Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 border rounded-lg text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">투자 등급</div>
                    <div className={`text-2xl font-black ${getTierColor(investment.tier).split(' ')[0]}`}>{investment.tier}급</div>
                </div>
                <div className="p-4 bg-slate-50 border rounded-lg text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">총점</div>
                    <div className="text-2xl font-black text-slate-800">{investment.totalScore}</div>
                </div>
            </div>

            {/* Brutal Verdict Backdrop */}
            <div className="space-y-3">
                <h4 className="font-bold text-[10px] bg-rose-50 text-rose-800 px-2 py-1 rounded inline-block tracking-widest uppercase">💀 Brutal Verdict (냉혹한 판결)</h4>
                <div className="text-sm leading-relaxed p-4 bg-rose-50/50 border border-rose-100 rounded-lg text-rose-900 font-medium italic">
                    "{investment.currentAssessment.brutalVerdict}"
                </div>
            </div>

            {/* Grid Comparison */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <div className="font-bold text-[10px] flex items-center gap-2 text-green-700 uppercase tracking-wider">
                        <Check className="w-3 h-3" /> 강점 (Strengths)
                    </div>
                    <ul className="text-xs space-y-1.5">
                        {investment.currentAssessment.strengths && investment.currentAssessment.strengths.length > 0 ? (
                            investment.currentAssessment.strengths.map((s, i) => (
                                <li key={i} className="text-slate-600 flex gap-2">
                                    <span className="text-green-500 font-bold">•</span> {s}
                                </li>
                            ))
                        ) : (
                            <li className="text-slate-400 italic">감지된 강점 없음</li>
                        )}
                    </ul>
                </div>
                <div className="space-y-2">
                    <div className="font-bold text-[10px] flex items-center gap-2 text-orange-700 uppercase tracking-wider">
                        <X className="w-3 h-3" /> 약점 (Weaknesses)
                    </div>
                    <ul className="text-xs space-y-1.5">
                        {investment.currentAssessment.weaknesses.map((w, i) => (
                            <li key={i} className="text-slate-600 flex gap-2">
                                <span className="text-orange-500 font-bold">•</span> {w}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-2">
                    <div className="font-bold text-[10px] flex items-center gap-2 text-red-700 uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3" /> 리스크 (Risks)
                    </div>
                    <ul className="text-xs space-y-1.5">
                        {investment.currentAssessment.risks.map((r, i) => (
                            <li key={i} className="text-slate-600 flex gap-2">
                                <span className="text-red-500 font-bold">•</span> {r}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

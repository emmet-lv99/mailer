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
            {/* Score Grid & Conversion Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Score Card */}
                <div className="bg-slate-50 border rounded-lg p-4 flex flex-col justify-center items-center space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">투자 등급</div>
                    <div className={`text-4xl font-black ${getTierColor(investment.tier).split(' ')[0]} mb-1`}>{investment.tier}급</div>
                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                         <span>총점 <span className="text-slate-900">{investment.totalScore}</span></span>
                         <span className="text-slate-300">|</span>
                         <span>가치 <span className="text-slate-900">{investment.estimatedValue}</span></span>
                    </div>
                </div>

                {/* 2. Conversion Metrics Grid (New) */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50/50 border border-blue-100 rounded p-2 text-center">
                        <div className="text-[9px] text-blue-600 font-bold mb-0.5">도달 가능성</div>
                        <div className="text-sm font-bold text-blue-900">{investment.conversionMetrics.reachPotential}</div>
                    </div>
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded p-2 text-center">
                        <div className="text-[9px] text-indigo-600 font-bold mb-0.5">구매 의향</div>
                        <div className="text-sm font-bold text-indigo-900">{investment.conversionMetrics.purchaseIntent}</div>
                    </div>
                    <div className="bg-violet-50/50 border border-violet-100 rounded p-2 text-center">
                         <div className="text-[9px] text-violet-600 font-bold mb-0.5">전환 확률</div>
                         <div className="text-sm font-bold text-violet-900">{investment.conversionMetrics.conversionLikelihood}</div>
                    </div>
                     <div className="bg-emerald-50/50 border border-emerald-100 rounded p-2 text-center">
                          <div className="text-[9px] text-emerald-600 font-bold mb-0.5">예상 구매자</div>
                          <div className="text-sm font-bold text-emerald-900">{investment.conversionMetrics.estimatedBuyers || '-'}</div>
                     </div>
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

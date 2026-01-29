"use client";

import { Badge } from "@/components/ui/badge";
import { InfluencerExpert } from "@/lib/agent/types";
import { Calendar, Sparkles } from "lucide-react";
import { getGradeColor, getTierColor } from "./utils";

interface ExpertTabProps {
    expert: InfluencerExpert;
}

export function ExpertTab({ expert }: ExpertTabProps) {
    return (
        <div className="p-6 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:ring-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-center">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">성장 등급</div>
                    <div className={`text-xl font-black ${getGradeColor(expert.grade).split(' ')[0]}`}>{expert.grade}</div>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-center">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">육성 점수</div>
                    <div className="text-xl font-black text-indigo-900">{expert.totalScore}</div>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg col-span-2 text-center flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">전문가 강력 추천</div>
                    <div className="text-sm font-bold text-indigo-900">{expert.recommendation}</div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-bold text-[10px] bg-indigo-100 text-indigo-800 px-2 py-1 rounded inline-block tracking-widest uppercase">🌱 Expert Verdict (육성 의견)</h4>
                <div className="text-sm leading-relaxed p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-900 font-medium italic">
                    "{expert.futureAssessment.expertVerdict}"
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 6개월 ~ 1년 성장 예측
                    </h4>
                    <Badge className="bg-slate-800 text-[10px]">{expert.futureAssessment.growthTrajectory}</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: '3M', data: (expert.futureAssessment.projectedMetrics as any)?.in3Months },
                        { label: '6M', data: (expert.futureAssessment.projectedMetrics as any)?.in6Months },
                        { label: '12M', data: (expert.futureAssessment.projectedMetrics as any)?.in12Months },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">{item.label}</div>
                            {item.data ? (
                                <>
                                    <div className={`text-base font-black mb-1 ${getTierColor(item.data.tier).split(' ')[0]}`}>{item.data.tier}급</div>
                                    <div className="text-[10px] font-bold text-slate-800">{item.data.followers?.toLocaleString() || 0}명</div>
                                    <div className="text-[9px] text-slate-400">ER {item.data.er}%</div>
                                </>
                            ) : (
                                <div className="text-[10px] text-slate-400 italic py-2">N/A</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50/30 p-4 rounded-lg border border-blue-100/50">
                    <h5 className="text-[10px] font-bold text-blue-700 mb-3 uppercase tracking-wider flex items-center gap-2"><Sparkles className="w-3 h-3" /> 숨겨진 잠재력</h5>
                    <div className="flex flex-wrap gap-2">
                        {expert.futureAssessment.hiddenStrengths.length > 0 ? (
                            expert.futureAssessment.hiddenStrengths.map((s, i) => (
                                <Badge key={i} variant="secondary" className="bg-white text-blue-600 border-blue-100 text-[10px] font-normal">
                                    {s}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-[10px] text-slate-400">아직 발견된 숨겨진 잠재력이 없습니다.</p>
                        )}
                    </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h5 className="text-[10px] font-bold text-slate-700 mb-2 uppercase tracking-wider">Strategic Advice</h5>
                    <ul className="text-xs space-y-2">
                        {expert.futureAssessment.strategicAdvice.map((a, i) => (
                            <li key={i} className="text-slate-600 flex gap-2">
                                <span className="text-indigo-400 font-bold">{i+1}.</span> {a}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

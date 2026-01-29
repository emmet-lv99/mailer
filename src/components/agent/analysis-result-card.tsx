"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DualRoleAnalysis } from "@/lib/agent/types";
import { getProxiedUrl } from "@/services/instagram/utils";
import { AlertTriangle, Calendar, Check, Sparkles, TrendingUp, X } from "lucide-react";


interface Props {
  analysis: DualRoleAnalysis;
}

export function AnalysisResultCard({ analysis }: Props) {
  const { investmentAnalyst: investment, influencerExpert: expert, comparisonSummary: comparison, basicStats } = analysis;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'A': return 'text-emerald-600 border-emerald-200 bg-emerald-50';
      case 'B': return 'text-amber-600 border-amber-200 bg-amber-50';
      case 'C': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'D': return 'text-red-600 border-red-200 bg-red-50';
      default: return 'text-slate-600 border-slate-200 bg-slate-50';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Star': return 'text-purple-600 border-purple-200 bg-purple-50';
      case 'Rising': return 'text-indigo-600 border-indigo-200 bg-indigo-50';
      case 'Potential': return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'Stagnant': return 'text-slate-600 border-slate-200 bg-slate-50';
      case 'Declining': return 'text-rose-600 border-rose-200 bg-rose-50';
      default: return 'text-slate-600 border-slate-200 bg-slate-50';
    }
  };

  return (
    <Card className="w-full max-w-2xl overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg bg-white dark:bg-zinc-950">
      {/* --- Basic Stats Header --- */}
      {basicStats && (
        <div className="p-6 flex flex-col sm:flex-row gap-6 border-b bg-muted/30">
            <div className="flex items-start gap-4 flex-1">
                <div className="shrink-0">
                  <Avatar className="w-16 h-16 border-2 shadow-sm">
                    <AvatarImage src={getProxiedUrl(basicStats.profilePicUrl)} alt={basicStats.username} className="object-cover" />
                    <AvatarFallback className="text-2xl">👤</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold">{basicStats.username}</h3>
                        <div className="flex gap-2">
                           {/* Tier Badge */}
                           <Badge variant="outline" className={`text-[10px] font-bold uppercase border-slate-200`}>
                                {investment.decision}
                           </Badge>

                           {/* Market Suitability Badge */}
                           {analysis.badges && !analysis.badges.isMarketSuitable && (
                                <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-none text-[10px]">기준 미달</Badge>
                           )}

                           {/* Authenticity Badge */}
                           {analysis.badges && (
                               analysis.badges.authenticity?.isFake ? (
                                   <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none text-[10px]">가짜 의심</Badge>
                               ) : (
                                   <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-none text-[10px]">신뢰도 {analysis.badges.authenticity?.authenticityScore}</Badge>
                               )
                           )}

                           {/* Campaign Suitability Badge */}
                           {analysis.badges && (
                               <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-none text-[10px]">캠페인 적합도 분석</Badge>
                           )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-foreground">{basicStats.followers?.toLocaleString()}</span> 팔로워
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-emerald-600">ER {basicStats.er}%</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-end border-l pl-6 border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-right">Final ROI Score</div>
                <div className="text-3xl font-black text-slate-900">{investment.totalScore}<span className="text-sm font-normal text-slate-400">/100</span></div>
            </div>
        </div>
      )}

      <div className="p-0">
        <Tabs defaultValue="investment" className="w-full">
            <div className="px-6 pt-4 border-b bg-muted/10">
                <TabsList className="grid w-full grid-cols-3 max-w-[420px] bg-slate-100/50 p-1">
                    <TabsTrigger value="investment" className="text-xs font-bold data-[state=active]:text-blue-700">투자심사역 (냉혹)</TabsTrigger>
                    <TabsTrigger value="expert" className="text-xs font-bold data-[state=active]:text-purple-700">전문가 (육성)</TabsTrigger>
                    <TabsTrigger value="verdict" className="text-xs font-bold data-[state=active]:text-slate-900">종합 판결</TabsTrigger>
                </TabsList>
            </div>

            {/* 1. Investment Analyst View */}
            <TabsContent value="investment" className="p-6 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:ring-0">
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
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg col-span-2 flex items-center justify-center gap-4">
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">예상 가치</div>
                            <div className="text-sm font-bold text-slate-800">{investment.estimatedValue}</div>
                        </div>
                        <div className="w-px h-8 bg-blue-100" />
                        <div className="text-center">
                            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">기준 ROI</div>
                            <div className="text-sm font-bold text-slate-800">{investment.expectedROI}</div>
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
            </TabsContent>

            {/* 2. Influencer Expert View */}
            <TabsContent value="expert" className="p-6 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:ring-0">
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
                            {expert.futureAssessment.hiddenStrengths.map((s, i) => (
                                <Badge key={i} variant="secondary" className="bg-white text-blue-600 border-blue-100 text-[10px] font-normal">
                                    {s}
                                </Badge>
                            ))}
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
            </TabsContent>

            {/* 3. Final Verdict View */}
            <TabsContent value="verdict" className="p-6 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 focus-visible:ring-0">
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
            </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}

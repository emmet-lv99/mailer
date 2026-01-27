"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstagramUser } from "@/services/instagram/types";
import {
    calculateAuthenticity,
    calculateCampaignSuitability,
    calculateEngagementRate,
    getAccountGrade,
    getAccountTier,
    getAverageUploadCycle,
    getLatestPostDate,
    isMarketSuitable,
    isUserActive
} from "@/services/instagram/utils";
import { Check, Loader2, X } from "lucide-react";
import { AnalysisResult } from "../../types";
import { MetricsBadges } from "./MetricsBadges";
import { PostsGrid } from "./PostsGrid";

interface AnalysisResultCardProps {
  result: AnalysisResult;
  originalUser: InstagramUser | undefined;
  registering: Set<string>;
  onRegister: (user: any) => void;
  onRemove: (username: string) => void;
  onPostSelect: (post: any) => void;
}

export function AnalysisResultCard({
  result,
  originalUser,
  registering,
  onRegister,
  onRemove,
  onPostSelect
}: AnalysisResultCardProps) {
  // Calculate Metrics
  let metrics = null;
  if (originalUser) {
    const latestDate = getLatestPostDate(originalUser);
    const isActive = isUserActive(latestDate);
    const avgCycle = getAverageUploadCycle(originalUser.recent_posts);
    const { authenticityScore, isFake, details: authDetails } = calculateAuthenticity(originalUser);
    const er = calculateEngagementRate(originalUser);
    const tier = getAccountTier(originalUser.followers_count);
    const grade = getAccountGrade(originalUser);
    const campaignResults = calculateCampaignSuitability(originalUser);
    const marketSuitable = isMarketSuitable(originalUser, avgCycle);
    
    metrics = { isActive, avgCycle, authenticityScore, isFake, er, tier, grade, campaignResults, marketSuitable, authDetails };
  }

  // Error State
  if (!result.success) {
    return (
      <Card className="p-6 border-l-4 border-l-red-500 shadow-sm bg-red-50/50">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200 shrink-0">
            {originalUser?.profile_pic_url ? (
              <img src={`/api/image-proxy?url=${encodeURIComponent(originalUser.profile_pic_url)}`} alt="" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div>
            <div className="font-bold text-red-700 flex items-center gap-2 text-lg">
              @{result.username}
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">
                분석 실패
              </span>
            </div>
            <div className="text-red-600/80 mt-1">
              {result.error || "알 수 없는 오류가 발생했습니다."}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const { analysis } = result;
  if (!analysis) return null;

  // Destructure with default empty objects to prevent crashes if something slips
  const { investmentAnalyst: investment, influencerExpert: expert, comparisonSummary: comparison } = analysis;

  const reelsPosts = originalUser?.recent_posts?.filter((p: any) => p.productType === 'clips') || [];

  return (
    <Card className="overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg bg-white dark:bg-zinc-950">
      {/* Card Header: Profile & Score */}
      <div className="p-6 flex flex-col sm:flex-row gap-6 border-b bg-muted/30">
        {/* Profile Info */}
        <div className="flex items-start gap-4 flex-1">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-background border-2 shadow-sm overflow-hidden">
              {originalUser?.profile_pic_url ? (
                <img src={`/api/image-proxy?url=${encodeURIComponent(originalUser.profile_pic_url)}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl flex items-center justify-center h-full w-full bg-muted text-muted-foreground">👤</span>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold">{originalUser?.full_name || result.username}</h3>
              {investment && (
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                  investment.decision.includes('금지') ? 'bg-red-100 text-red-700 border-red-200' :
                  investment.decision.includes('보류') ? 'bg-orange-100 text-orange-700 border-orange-200' :
                  'bg-green-100 text-green-700 border-green-200'
                }`}>
                  {investment.decision}
                </span>
              )}
            </div>
            <a 
              href={`https://instagram.com/${result.username}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-sm text-muted-foreground font-medium hover:text-primary hover:underline cursor-pointer inline-block"
            >
              @{result.username}
            </a>
            <div className="text-sm text-muted-foreground line-clamp-1">{originalUser?.biography}</div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <span className="font-bold text-foreground">{originalUser?.followers_count === -1 ? '?' : originalUser?.followers_count.toLocaleString()}</span> 팔로워
              </span>
              <span className="flex items-center gap-1">
                <span className="font-bold text-foreground">{originalUser?.recent_posts?.length || 0}</span> 분석된 게시물
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Badges */}
        {metrics && <MetricsBadges metrics={metrics} originalUser={originalUser} />}
      </div>
      
      <div className="p-0">
        <Tabs defaultValue="investment" className="w-full">
            <div className="px-6 pt-4 border-b bg-muted/10">
                <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                    <TabsTrigger value="investment">투자심사역 (냉혹)</TabsTrigger>
                    <TabsTrigger value="expert">전문가 (육성)</TabsTrigger>
                    <TabsTrigger value="verdict">종합 판결</TabsTrigger>
                </TabsList>
            </div>

            {/* 1. Investment Analyst View */}
            <TabsContent value="investment" className="p-6 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {investment ? (
                    <>
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-slate-50 border rounded-lg">
                                <div className="text-xs text-muted-foreground font-medium mb-1">투자 등급</div>
                                <div className="text-2xl font-black text-slate-800">{investment.tier}급</div>
                            </div>
                            <div className="p-4 bg-slate-50 border rounded-lg">
                                <div className="text-xs text-muted-foreground font-medium mb-1">총점</div>
                                <div className="text-2xl font-black text-slate-800">{investment.totalScore}점</div>
                            </div>
                            <div className="p-4 bg-slate-50 border rounded-lg md:col-span-2">
                                <div className="text-xs text-muted-foreground font-medium mb-1">예상 가치 / ROI</div>
                                <div className="text-sm font-bold text-slate-800">{investment.estimatedValue}</div>
                                <div className="text-xs text-slate-500 mt-1">{investment.expectedROI}</div>
                            </div>
                        </div>

                        {/* Brutal Verdict */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-sm bg-red-50 text-red-800 px-3 py-1.5 rounded inline-block">💀 Brutal Verdict (냉혹한 판결)</h4>
                            <div className="text-sm leading-relaxed p-4 bg-red-50/50 border border-red-100 rounded-lg text-red-900 font-medium">
                                {investment.currentAssessment.brutalVerdict}
                            </div>
                        </div>

                        {/* Detailed Assessment */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="font-semibold text-sm flex items-center gap-2 text-green-700">
                                    <Check className="w-4 h-4" />강점 (Strengths)
                                </div>
                                <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
                                    {investment.currentAssessment.strengths.length > 0 ? (
                                        investment.currentAssessment.strengths.map((s, i) => <li key={i}>{s}</li>)
                                    ) : (
                                        <li className="text-slate-400">특별한 강점 없음</li>
                                    )}
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <div className="font-semibold text-sm flex items-center gap-2 text-orange-700">
                                    <X className="w-4 h-4" /> 약점 (Weaknesses)
                                </div>
                                <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
                                    {investment.currentAssessment.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <div className="font-semibold text-sm flex items-center gap-2 text-red-700">
                                    <span className="text-xs">⚠️</span> 리스크 (Risks)
                                </div>
                                <ul className="text-sm space-y-1 list-disc pl-4 text-muted-foreground">
                                    {investment.currentAssessment.risks.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10 text-muted-foreground">투자 심사 데이터가 없습니다.</div>
                )}
            </TabsContent>

             {/* 2. Influencer Expert View */}
             <TabsContent value="expert" className="p-6 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {expert ? (
                    <>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                                <div className="text-xs text-indigo-600 font-medium mb-1">성장 등급</div>
                                <div className="text-xl font-bold text-indigo-900">{expert.grade}</div>
                            </div>
                             <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                                <div className="text-xs text-indigo-600 font-medium mb-1">육성 점수</div>
                                <div className="text-xl font-bold text-indigo-900">{expert.totalScore}점</div>
                            </div>
                             <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg md:col-span-2">
                                <div className="text-xs text-indigo-600 font-medium mb-1">전문가 추천</div>
                                <div className="text-sm font-bold text-indigo-900">{expert.recommendation}</div>
                            </div>
                        </div>

                         {/* Growth Analysis Grid */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(expert.growthAnalysis || {}).map(([key, value]) => (
                                <div key={key} className="p-3 bg-white border rounded text-xs">
                                    <div className="text-muted-foreground font-semibold mb-1 uppercase tracking-wider">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div className="text-indigo-900 font-medium break-keep">{value}</div>
                                </div>
                            ))}
                         </div>

                         <div className="space-y-3">
                            <h4 className="font-bold text-sm bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded inline-block">🌱 Expert Verdict (육성 의견)</h4>
                            <div className="text-sm leading-relaxed p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-900 font-medium">
                                {expert.futureAssessment.expertVerdict}
                                <div className="mt-2 pt-2 border-t border-indigo-200/50 text-indigo-800 text-xs">
                                   <strong>성장 궤적:</strong> {expert.futureAssessment.growthTrajectory}
                                </div>
                            </div>
                        </div>

                         {/* Hidden Strengths & Risks */}
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                <h5 className="text-xs font-bold text-blue-700 mb-2 uppercase">잠재력 (Hidden Strengths)</h5>
                                <ul className="text-xs space-y-1 list-disc pl-4 text-blue-900">
                                    {expert.futureAssessment.hiddenStrengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                                <h5 className="text-xs font-bold text-orange-700 mb-2 uppercase">잠재 리스크 (Potential Risks)</h5>
                                <ul className="text-xs space-y-1 list-disc pl-4 text-orange-900">
                                    {expert.futureAssessment.potentialRisks.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <h4 className="font-bold text-sm text-foreground">💡 전략적 조언 (Strategic Advice)</h4>
                             <div className="grid md:grid-cols-2 gap-3">
                                {expert.futureAssessment.strategicAdvice.map((advice, i) => (
                                    <div key={i} className="text-sm p-3 border rounded flex gap-2 bg-slate-50 border-slate-200 text-slate-700">
                                        <span className="text-indigo-500 font-bold shrink-0">{i+1}.</span>
                                        {advice}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                 ) : (
                    <div className="text-center py-10 text-muted-foreground">전문가 분석 데이터가 없습니다.</div>
                )}
             </TabsContent>

            {/* 3. Verdict View */}
             <TabsContent value="verdict" className="p-6 m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {comparison ? (
                    <div className="space-y-6">
                        <div className={`p-4 rounded-lg border ${comparison.agreement ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                             <div className="font-bold text-lg mb-2 flex items-center gap-2">
                                {comparison.agreement ? (
                                    <span className="text-green-700">✅ 의견 일치</span>
                                ) : (
                                    <span className="text-orange-700">⚡ 의견 불일치 (쟁점 존재)</span>
                                )}
                             </div>
                             <p className="text-sm text-foreground/80 leading-relaxed">
                                {comparison.keyDifference}
                             </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-bold text-lg">최종 권고 사항</h4>
                            <div className="p-6 bg-slate-900 text-slate-100 rounded-xl shadow-lg leading-relaxed text-base min-h-[100px] flex items-center justify-center text-center">
                                "{comparison.recommendation}"
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 mt-4">
                            <Button 
                                variant="outline" 
                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12"
                                onClick={() => onRemove(result.username)}
                            >
                                부적합 (제외)
                            </Button>
                            <Button 
                                className={`flex-1 ${originalUser?.is_registered ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white h-12`}
                                disabled={originalUser?.is_registered || registering.has(result.username)}
                                onClick={() => originalUser && onRegister({
                                ...originalUser,
                                analysis: analysis
                                })}
                            >
                                {registering.has(result.username) ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 등록 중</>
                                ) : originalUser?.is_registered ? (
                                "등록됨 (관리중)"
                                ) : (
                                "최종 심사 통과 (등록)"
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                     <div className="text-center py-10 text-muted-foreground">종합 판결 데이터가 없습니다.</div>
                )}
             </TabsContent>
        </Tabs>
      </div>

       <div className="h-px bg-border/50" />

        {/* Reels Section */}
        <div className="p-6 pt-0 mt-6">
            <h4 className="font-bold text-sm mb-4 text-muted-foreground">최근 인기 콘텐츠</h4>
            {reelsPosts.length > 0 && (
            <PostsGrid posts={reelsPosts} type="reels" onPostSelect={onPostSelect} />
            )}

            {/* All Posts */}
            <div className="mt-4">
                <PostsGrid posts={originalUser?.recent_posts || []} type="all" onPostSelect={onPostSelect} />
            </div>
        </div>
    </Card>
  );
}

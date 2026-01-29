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
import { ArrowDown, ArrowRight, ArrowUp, Check, Clock, Loader2, X } from "lucide-react";
import { AnalysisResult, TrendMetrics } from "../../types";
import { MetricsBadges } from "./MetricsBadges";
import { PostsGrid } from "./PostsGrid";

// Trend Metrics Display Component
function TrendMetricsBadge({ trendMetrics }: { trendMetrics: TrendMetrics }) {
  const getTrendIcon = () => {
    switch (trendMetrics.erTrend) {
      case 'rising': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <ArrowRight className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trendMetrics.erTrend) {
      case 'rising': return 'bg-green-50 border-green-200 text-green-700';
      case 'declining': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getTrendLabel = () => {
    switch (trendMetrics.erTrend) {
      case 'rising': return '상승';
      case 'declining': return '하락';
      default: return '유지';
    }
  };

  return (
    <div className="p-3 rounded-lg border bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 space-y-2">
      <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide">📊 트렌드 분석 ({trendMetrics.totalPosts}개 게시물)</div>
      
      {/* ER Trend Badge */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-bold ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>ER {getTrendLabel()}</span>
          <span className="ml-1">
            {trendMetrics.erChangePercent > 0 ? '+' : ''}{trendMetrics.erChangePercent}%
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          업로드 주기: <span className="font-semibold">{trendMetrics.avgUploadFrequency}일</span>
        </div>
      </div>

      {/* Period Comparison Mini Chart */}
      <div className="flex items-end gap-1 h-8">
        {[
          { label: '이전', data: trendMetrics.periodComparison.oldest },
          { label: '중간', data: trendMetrics.periodComparison.middle },
          { label: '최근', data: trendMetrics.periodComparison.recent }
        ].map((period, i) => {
          const maxER = Math.max(
            trendMetrics.periodComparison.oldest.er,
            trendMetrics.periodComparison.middle.er,
            trendMetrics.periodComparison.recent.er
          );
          const height = maxER > 0 ? (period.data.er / maxER) * 100 : 50;
          
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full rounded-t transition-all ${
                  i === 2 ? 'bg-purple-500' : i === 1 ? 'bg-purple-400' : 'bg-purple-300'
                }`}
                style={{ height: `${Math.max(height, 20)}%` }}
                title={`${period.label}: ER ${period.data.er}%`}
              />
              <div className="text-[9px] text-muted-foreground mt-0.5">{period.data.er}%</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground px-1">
        <span>이전 {trendMetrics.totalPosts - Math.floor(trendMetrics.totalPosts / 3) * 2}개</span>
        <span>중간 {Math.floor(trendMetrics.totalPosts / 3)}개</span>
        <span>최근 {Math.floor(trendMetrics.totalPosts / 3)}개</span>
      </div>
    </div>
  );
}

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
    const isRateLimit = result.error?.includes('429') || result.error?.includes('Resource exhausted') || result.error?.includes('Quota exceeded');

    if (isRateLimit) {
      return (
        <Card className="p-6 border-l-4 border-l-orange-500 shadow-sm bg-orange-50/50">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-200 shrink-0">
               <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <div className="font-bold text-orange-800 flex items-center gap-2 text-lg">
                시스템 과부하 (잠시 대기)
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
                  429 Too Many Requests
                </span>
              </div>
              <div className="text-orange-700 mt-2 text-sm leading-relaxed">
                <p><strong>구글 AI 분석 요청이 너무 많습니다.</strong></p>
                <p className="mt-1">잠시 후(약 30초~1분)에 다시 시도해주시면 정상적으로 처리됩니다.</p>
                <div className="text-xs text-orange-600/60 mt-2 pt-2 border-t border-orange-200/50">
                   Error Details: {result.error}
                </div>
              </div>
            </div>
          </div>
        </Card>
      );
    }

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
            <div className="w-20 h-20 rounded-full bg-background border-2 shadow-sm overflow-hidden flex items-center justify-center">
              {result.verifiedProfile?.profilePicUrl || originalUser?.profile_pic_url || analysis.basicStats?.profilePicUrl ? (
                <img 
                  src={`/api/image-proxy?url=${encodeURIComponent((result.verifiedProfile?.profilePicUrl || originalUser?.profile_pic_url || analysis.basicStats?.profilePicUrl) as string)}`} 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-4xl text-muted-foreground">👤</span>
              )}
            </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold">{result.verifiedProfile?.username || originalUser?.full_name || result.username}</h3>
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
            <div className="text-sm text-muted-foreground line-clamp-1">{result.verifiedProfile?.biography || originalUser?.biography}</div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <span className="font-bold text-foreground">
                    {(result.verifiedProfile?.followers || analysis.basicStats?.followers || originalUser?.followers_count || 0).toLocaleString()}
                </span> 팔로워
                {result.verifiedProfile?.isVerified ? (
                    <span className="text-blue-500 ml-1" title="실시간 검증된 데이터 (Source of Truth)">
                        <Check className="w-3 h-3 inline" />
                    </span>
                ) : (
                    <span className="text-orange-500 ml-1" title="실시간 검증 실패 (과거 데이터일 수 있음)">
                        ⚠️
                    </span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-bold text-foreground">{originalUser?.recent_posts?.length || 0}</span> 분석된 게시물
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Badges */}
        <div className="space-y-3">
          {metrics && <MetricsBadges metrics={metrics} originalUser={originalUser} />}
          {result.trendMetrics ? (
            <TrendMetricsBadge trendMetrics={result.trendMetrics} />
          ) : (
            <div className="p-3 rounded-lg border bg-gray-50 border-gray-200 text-xs text-gray-500">
              <span className="font-medium">📊 트렌드 분석 불가:</span> 게시물 10개 이상 필요 (현재 {originalUser?.recent_posts?.length || 0}개)
            </div>
          )}
        </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 1. Score Card */}
                            <div className="bg-slate-50 border rounded-lg p-4 flex flex-col justify-center items-center space-y-2">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">투자 등급</div>
                                <div className={`text-4xl font-black mb-1 ${
                                    investment.tier === 'S' ? 'text-violet-600' :
                                    investment.tier === 'A' ? 'text-blue-600' :
                                    investment.tier === 'B' ? 'text-green-600' :
                                    investment.tier === 'C' ? 'text-orange-500' : 'text-red-500'
                                }`}>{investment.tier}급</div>
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
                                    <div className="text-sm font-bold text-blue-900">{investment.conversionMetrics?.reachPotential || '-'}</div>
                                </div>
                                <div className="bg-indigo-50/50 border border-indigo-100 rounded p-2 text-center">
                                    <div className="text-[9px] text-indigo-600 font-bold mb-0.5">구매 의향</div>
                                    <div className="text-sm font-bold text-indigo-900">{investment.conversionMetrics?.purchaseIntent || '-'}</div>
                                </div>
                                <div className="bg-violet-50/50 border border-violet-100 rounded p-2 text-center">
                                     <div className="text-[9px] text-violet-600 font-bold mb-0.5">전환 확률</div>
                                     <div className="text-sm font-bold text-violet-900">{investment.conversionMetrics?.conversionLikelihood || '-'}</div>
                                </div>
                                 <div className="bg-emerald-50/50 border border-emerald-100 rounded p-2 text-center">
                                      <div className="text-[9px] text-emerald-600 font-bold mb-0.5">예상 구매자</div>
                                      <div className="text-sm font-bold text-emerald-900">{investment.conversionMetrics?.estimatedBuyers || '-'}</div>
                                 </div>
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

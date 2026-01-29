"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DualRoleAnalysis } from "@/lib/agent/types";
import { Sparkles } from "lucide-react";
import { BADGE_DESCRIPTIONS } from "./utils";

interface BadgeExplanationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedBadge: string | null;
    analysis: DualRoleAnalysis;
}

export function BadgeExplanationModal({ open, onOpenChange, selectedBadge, analysis }: BadgeExplanationModalProps) {
    if (!selectedBadge) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        {BADGE_DESCRIPTIONS[selectedBadge]?.title}
                    </DialogTitle>
                    
                    {selectedBadge === 'CAMPAIGN_FIT' && analysis.badges?.campaign ? (
                        <div className="pt-4 space-y-4">
                            {/* Sponsorship */}
                            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">협찬 (관계 중시)</h4>
                                    <div className="text-[10px] font-bold text-purple-600">
                                        {analysis.badges.campaign.sponsorship.passed ? "적합" : "검토 필요"}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-purple-900">{analysis.badges.campaign.sponsorship.score}<span className="text-sm font-normal">점</span></div>
                                    <div className="text-[10px] bg-white border border-purple-100 rounded px-1.5 py-0.5 inline-block text-slate-500 font-bold">
                                        {analysis.badges.campaign.sponsorship.grade}등급
                                    </div>
                                </div>
                            </div>

                            {/* Paid Ad */}
                            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">유료 광고 (도달 중시)</h4>
                                    <div className="text-[10px] font-bold text-purple-600">
                                        {analysis.badges.campaign.paidAd.passed ? "적합" : "검토 필요"}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-purple-900">{analysis.badges.campaign.paidAd.score}<span className="text-sm font-normal">점</span></div>
                                    <div className="text-[10px] bg-white border border-purple-100 rounded px-1.5 py-0.5 inline-block text-slate-500 font-bold">
                                        {analysis.badges.campaign.paidAd.grade}등급
                                    </div>
                                </div>
                            </div>

                            {/* Co-Purchase */}
                            <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">공동 구매 (전환 중시)</h4>
                                    <div className="text-[10px] font-bold text-purple-600">
                                        {analysis.badges.campaign.coPurchase.passed ? "적합" : "검토 필요"}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-purple-900">{analysis.badges.campaign.coPurchase.score}<span className="text-sm font-normal">점</span></div>
                                    <div className="text-[10px] bg-white border border-purple-100 rounded px-1.5 py-0.5 inline-block text-slate-500 font-bold">
                                        {analysis.badges.campaign.coPurchase.grade}등급
                                    </div>
                                </div>
                            </div>

                            <div className="text-[10px] text-slate-400 text-center pt-2">
                                * 각 캠페인 목적에 따른 가중치가 적용된 점수입니다.
                            </div>
                        </div>
                    ) : (selectedBadge === 'HIGH_TRUST' || selectedBadge === 'FAKE_SUSPECTED') && analysis.badges?.authenticity ? (
                        <div className="pt-4 space-y-6">
                            <div className="text-center pb-2 border-b border-slate-100">
                                 <h3 className="text-lg font-bold text-green-800">신뢰도 점수 분석</h3>
                            </div>

                            {/* Comment Ratio */}
                            <div className="space-y-2">
                                 <div className="flex justify-between items-center text-sm">
                                     <span className="font-bold flex items-center gap-1.5">
                                        <span className="text-green-600">✅</span> 댓글 비율
                                     </span>
                                     <span className="font-bold text-green-700">
                                         {Math.round(((analysis.badges.authenticity.details.commentScore || 0) / 20) * 100)}% 
                                         <span className="text-xs text-slate-400 font-normal ml-1">(+{analysis.badges.authenticity.details.commentScore || 0}/20점)</span>
                                     </span>
                                 </div>
                                 <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-red-100 via-orange-100 to-green-100">
                                     <div 
                                        className="absolute top-0 bottom-0 w-1.5 bg-slate-800 rounded-full shadow-sm"
                                        style={{ left: `${Math.min(((analysis.badges.authenticity.details.commentScore || 0) / 20) * 100, 100)}%` }}
                                     />
                                 </div>
                            </div>

                            {/* View Ratio */}
                            <div className="space-y-2">
                                 <div className="flex justify-between items-center text-sm">
                                     <span className="font-bold flex items-center gap-1.5">
                                        {analysis.badges.authenticity.details.viewScore === null ? (
                                            <span className="text-slate-400">⏺</span> 
                                        ) : (
                                            <span className="text-green-600">✅</span>
                                        )}
                                        조회수 비율
                                     </span>
                                     <span className="font-bold text-green-700">
                                         {analysis.badges.authenticity.details.viewScore !== null 
                                            ? Math.round(((analysis.badges.authenticity.details.viewScore) / 20) * 100)
                                            : 0 }% 
                                         <span className="text-xs text-slate-400 font-normal ml-1">(+{analysis.badges.authenticity.details.viewScore || 0}/20점)</span>
                                     </span>
                                 </div>
                                 <div className="relative h-3 w-full rounded-full bg-gradient-to-r from-red-100 via-orange-100 to-green-100">
                                     <div 
                                        className="absolute top-0 bottom-0 w-1.5 bg-slate-800 rounded-full shadow-sm"
                                        style={{ left: `${Math.min(((analysis.badges.authenticity.details.viewScore || 0) / 20) * 100, 100)}%` }}
                                     />
                                 </div>
                            </div>

                            {/* Consistency */}
                            <div className="space-y-2">
                                 <div className="flex justify-between items-center text-sm">
                                     <span className="font-bold flex items-center gap-1.5">
                                        {(analysis.badges.authenticity.details.consistencyScore || 0) < 10 ? (
                                            <span className="text-orange-500">⚠️</span>
                                        ) : (
                                            <span className="text-green-600">✅</span>
                                        )} 
                                        참여도 균형
                                     </span>
                                     <span className="font-bold text-green-700">
                                         {Math.round(((analysis.badges.authenticity.details.consistencyScore || 0) / 20) * 100)}% 
                                         <span className="text-xs text-slate-400 font-normal ml-1">(+{analysis.badges.authenticity.details.consistencyScore || 0}/20점)</span>
                                     </span>
                                 </div>
                            </div>

                            {/* Final Score Box */}
                            <div className="bg-green-50/50 rounded-xl p-5 border border-green-100/50 flex items-center justify-between mt-2">
                                <div>
                                    <h4 className="font-bold text-green-900 text-base mb-1">최종 신뢰 점수</h4>
                                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                        📊 분석 항목: {analysis.badges.authenticity.measuredMetrics?.length || 0}/3
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-green-900">
                                    {analysis.badges.authenticity.authenticityScore}
                                    <span className="text-sm font-normal text-green-700/50">/100</span>
                                </div>
                            </div>

                             <div className="space-y-1 pt-2 border-t border-slate-50">
                                <div className="text-[10px] text-slate-500">
                                    * {analysis.badges.authenticity.reason}
                                </div>
                                {(analysis.badges.authenticity.details.consistencyScore || 0) < 10 && analysis.badges.authenticity.details.viewScore !== null && (
                                    <div className="text-[10px] text-orange-600 font-bold">
                                        * 참여도 균형 주의: 피드/릴스 효율 차이 발생
                                    </div>
                                )}
                             </div>
                        </div>
                    ) : (selectedBadge === 'QUALIFICATION_UNMET' && analysis.badges?.criteria) ? (
                        <div className="pt-4 space-y-4">
                            <div className="text-center pb-2 border-b border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-900">자격 요건 분석</h3>
                                    <p className="text-xs text-slate-500 mt-1">활성 인플루언서 필수 기준</p>
                            </div>

                            {/* 1. Followers Check */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        👥 팔로워 1,000명 이상
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        현재: <span className="font-bold">{analysis.badges.criteria.checks.followers.value.toLocaleString()}명</span>
                                    </div>
                                </div>
                                <div>
                                    {analysis.badges.criteria.checks.followers.passed ? (
                                        <Badge className="bg-green-100 text-green-700 border-none">통과</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-600 border-none">미달</Badge>
                                    )}
                                </div>
                            </div>

                            {/* 2. Recent Activity Check */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        📅 최근 7일 내 활동
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        마지막 활동: <span className="font-bold">{analysis.badges.criteria.checks.recentPost.value}</span>
                                    </div>
                                </div>
                                <div>
                                    {analysis.badges.criteria.checks.recentPost.passed ? (
                                        <Badge className="bg-green-100 text-green-700 border-none">통과</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-600 border-none">미달</Badge>
                                    )}
                                </div>
                            </div>

                            {/* 3. Upload Frequency Check */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        🔄 주 1회 이상 업로드
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        평균 주기: <span className="font-bold">{analysis.badges.criteria.checks.frequency.value ? `${analysis.badges.criteria.checks.frequency.value}일` : "산출 불가"}</span>
                                    </div>
                                </div>
                                <div>
                                    {analysis.badges.criteria.checks.frequency.passed ? (
                                        <Badge className="bg-green-100 text-green-700 border-none">통과</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-600 border-none">미달</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <DialogDescription className="pt-2 text-base leading-relaxed text-slate-700">
                            {BADGE_DESCRIPTIONS[selectedBadge]?.description}
                        </DialogDescription>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

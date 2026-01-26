"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { MetricsBadges } from "./MetricsBadges";
import { PostsGrid } from "./PostsGrid";

interface AnalysisResult {
  username: string;
  success: boolean;
  error?: string;
  analysis?: {
    summary: string;
    mood_keywords?: string[];
  };
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

  const reelsPosts = originalUser?.recent_posts?.filter((p: any) => p.productType === 'clips') || [];

  return (
    <Card className="overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg">
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
      
      <div className="p-6 flex flex-col gap-6">
        {/* Analysis Content (Summary) */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2 text-foreground/80 flex items-center gap-2">
              💡 AI 분석 요약
            </h4>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border">
              {analysis.summary}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.mood_keywords?.map((keyword: string, k: number) => (
              <span key={k} className="px-3 py-1 bg-white dark:bg-slate-800 border rounded-full text-xs text-muted-foreground shadow-sm">
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-border/50" />

        {/* Reels Section */}
        {reelsPosts.length > 0 && (
          <PostsGrid posts={reelsPosts} type="reels" onPostSelect={onPostSelect} />
        )}

        {/* All Posts */}
        <PostsGrid posts={originalUser?.recent_posts || []} type="all" onPostSelect={onPostSelect} />
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t mt-4">
          <Button 
            variant="outline" 
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onRemove(result.username)}
          >
            부적합
          </Button>
          <Button 
            className={`flex-1 ${originalUser?.is_registered ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
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
              "등록"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface HistoryUser {
  username: string;
  full_name: string;
  profile_pic_url?: string;
  followers_count: number;
  originality_score?: number;
  mood_keywords?: string[];
  analysis_summary?: string;
}

interface AnalysisDialogProps {
  user: HistoryUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalysisDialog({ user, open, onOpenChange }: AnalysisDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            @{user.username} <span className="text-lg font-normal text-muted-foreground">분석 결과</span>
          </DialogTitle>
          <DialogDescription>
            AI가 분석한 인플루언서의 상세 리포트입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted overflow-hidden border">
                {user.profile_pic_url ? (
                  <img src={`/api/image-proxy?url=${encodeURIComponent(user.profile_pic_url)}`} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">👤</div>
                )}
              </div>
              <div>
                <div className="font-bold text-lg">{user.full_name}</div>
                <div className="text-sm text-muted-foreground">{user.followers_count?.toLocaleString()} 팔로워</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">독창성 점수</div>
              <div className="text-4xl font-extrabold text-primary">{user.originality_score}<span className="text-lg text-muted-foreground font-medium">/10</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">키워드</h4>
            <div className="flex flex-wrap gap-2">
              {user.mood_keywords && Array.isArray(user.mood_keywords) ? (
                user.mood_keywords.map((k: string, i: number) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1">
                    #{k}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">키워드 없음</span>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">AI 분석 요약</h4>
            <div className="bg-slate-50 dark:bg-slate-900 border p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap h-[200px] overflow-y-auto">
              {user.analysis_summary}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

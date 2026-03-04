import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatNumber, getProxiedUrl } from "@/services/instagram/utils";
import { Loader2, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface SimilarUser {
  username: string;
  similarity: number;
  full_analysis: any;
}

interface SimilarInfluencersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export function SimilarInfluencersModal({
  open,
  onOpenChange,
  username
}: SimilarInfluencersModalProps) {
  const [similar, setSimilar] = useState<SimilarUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && username) {
      fetchSimilar();
    }
  }, [open, username]);

  const fetchSimilar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/instagram/similar?username=${username}`);
      const data = await res.json();
      
      if (!res.ok) {
          throw new Error(data.error || "Failed to fetch similar accounts");
      }
      
      setSimilar(data.results || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            유사 인플루언서 추천
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-bold text-foreground">@{username}</span> 님과 데이터 패턴이 유사한 계정들입니다.
          </p>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-sm text-muted-foreground">유사 계정 분석 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-sm text-red-500">{error}</p>
              {error.includes("NO_EMBEDDING") && (
                <p className="text-xs text-muted-foreground mt-2">
                  분석 정보가 최신이 아닐 수 있습니다. <br/> "최신 정보 불러오기" 후 다시 시도해주세요.
                </p>
              )}
            </div>
          ) : similar.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>유사한 계정을 찾지 못했습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {similar.map((u, idx) => {
                const stats = u.full_analysis?.basicStats || {};
                const analysis = u.full_analysis || {};
                const similarityPercent = Math.round((u.similarity || 0) * 100);
                
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors group">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-background border shadow-sm">
                      {stats.profilePicUrl ? (
                         <img src={getProxiedUrl(stats.profilePicUrl)} alt="" className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-xs">👤</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-sm truncate">@{u.username}</span>
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">
                           {similarityPercent}% 일치
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                         <span>팔로워 {formatNumber(stats.followers || 0)}</span>
                         <span>•</span>
                         <span>ER {stats.er || analysis.metrics?.totalER || 0}%</span>
                         <span>•</span>
                         <span className="font-medium text-indigo-600">{analysis.investmentAnalyst?.tier || 'D'}등급</span>
                      </div>
                    </div>
                    <a 
                        href={`https://instagram.com/${u.username}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

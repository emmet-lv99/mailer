
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

interface Setting {
  key: string;
  value: string;
  description: string;
  type: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function GeneralSettings() {
  const { mutate } = useSWRConfig();
  const { data: settings, error } = useSWR<Setting[]>("/api/settings?type=INSTA", fetcher);
  
  const [limit, setLimit] = useState("10"); // Analysis Limit
  const [postLimit, setPostLimit] = useState("10"); // Search Post Limit
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      const limitSetting = settings.find(s => s.key === 'insta_analysis_limit');
      if (limitSetting) setLimit(limitSetting.value);
      
      const postLimitSetting = settings.find(s => s.key === 'insta_post_limit');
      if (postLimitSetting) setPostLimit(postLimitSetting.value);
    }
  }, [settings]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save Analysis Limit
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "insta_analysis_limit",
          value: limit,
          description: "AI 분석 시 참조할 최근 게시물 수",
          type: "INSTA"
        }),
      });

      // Save Post Limit
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "insta_post_limit",
          value: postLimit,
          description: "검색 시 수집할 최근 게시물 수",
          type: "INSTA"
        }),
      });

      toast.success("설정이 저장되었습니다.");
      mutate("/api/settings?type=INSTA");
    } catch (error) {
      console.error(error);
      toast.error("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-red-500">설정을 불러오는데 실패했습니다.</div>;
  if (!settings) return <div className="text-muted-foreground">로딩 중...</div>;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>분석 및 수집 설정</CardTitle>
          <CardDescription>
            AI 분석 및 데이터 수집 시 사용할 파라미터를 설정합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="limit">최근 게시물 분석 개수 (AI)</Label>
            <Input 
              type="number" 
              id="limit" 
              placeholder="10" 
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="1"
              max="50"
            />
            <p className="text-sm text-muted-foreground">
              AI 분석 시 Gemini에게 제공할 최근 게시물 수입니다.
            </p>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="postLimit">검색 게시물 수집 개수 (Apify)</Label>
            <Input 
              type="number" 
              id="postLimit" 
              placeholder="10" 
              value={postLimit}
              onChange={(e) => setPostLimit(e.target.value)}
              min="1"
              max="20"
            />
            <p className="text-sm text-muted-foreground">
              ID 검색 시 저장할 최근 게시물의 최대 개수입니다.
            </p>
          </div>

          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "저장 중..." : "저장하기"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

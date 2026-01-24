"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ChannelInputCardProps {
  channelUrl: string;
  competitors: string[];
  onChannelDataChange: (url: string, competitors: string[]) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export function ChannelInputCard({
  channelUrl,
  competitors,
  onChannelDataChange,
  onAnalyze,
  isLoading
}: ChannelInputCardProps) {
  const [localUrl, setLocalUrl] = useState(channelUrl);
  const [competitorInput, setCompetitorInput] = useState("");

  const handleUrlChange = (value: string) => {
    setLocalUrl(value);
    onChannelDataChange(value, competitors);
  };

  const addCompetitor = () => {
    if (competitorInput && competitors.length < 3) {
      onChannelDataChange(localUrl, [...competitors, competitorInput]);
      setCompetitorInput("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>채널 정보 입력</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="channelUrl">유튜브 채널 URL</Label>
            <Input
              id="channelUrl"
              placeholder="https://www.youtube.com/@channel"
              value={localUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>경쟁 채널 (Optional)</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="URL 입력" 
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
              />
              <Button variant="outline" onClick={addCompetitor} disabled={competitors.length >= 3}>추가</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {competitors.map((url, i) => (
                <div key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">
                  {url}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg" 
          onClick={onAnalyze} 
          disabled={!localUrl || isLoading}
        >
          {isLoading ? "AI 분석 중... (약 10초)" : "분석 시작하기"}
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ChannelInputCardProps {
  channelUrl: string;
  referenceUrl: string;
  onChannelDataChange: (url: string, refUrl: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export function ChannelInputCard({
  channelUrl,
  referenceUrl,
  onChannelDataChange,
  onAnalyze,
  isLoading
}: ChannelInputCardProps) {
  const [localUrl, setLocalUrl] = useState(channelUrl);
  const [localRefUrl, setLocalRefUrl] = useState(referenceUrl);

  const handleChange = (newUrl: string, newRef: string) => {
    onChannelDataChange(newUrl, newRef);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>채널 정보 및 디자인 설정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* 1. Basic Info */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Channel URL */}
          <div className="space-y-2">
            <Label htmlFor="channelUrl">유튜브 채널 URL <span className="text-red-500">*</span></Label>
            <Input
              id="channelUrl"
              placeholder="https://www.youtube.com/@channel"
              value={localUrl}
              onChange={(e) => {
                setLocalUrl(e.target.value);
                handleChange(e.target.value, localRefUrl);
              }}
            />
          </div>

          {/* Reference URL */}
          <div className="space-y-2">
            <Label>참고하고 싶은 쇼핑몰 URL (Optional)</Label>
            <Input 
              placeholder="https://example-mall.com (구조 참고용)" 
              value={localRefUrl}
              onChange={(e) => {
                setLocalRefUrl(e.target.value);
                handleChange(localUrl, e.target.value);
              }}
            />
            <p className="text-[11px] text-slate-400">
              * 입력하신 사이트의 레이아웃 구조를 참고하되, 브랜드 컬러를 입혀서 디자인합니다.
            </p>
          </div>
        </div>

        <Button 
          className="w-full h-12 text-lg" 
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

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type } from "lucide-react";

interface FontSystemCardProps {
  fontFamily: string;
  weightRule: string;
  onFontChange: (font: string) => void;
  onWeightChange: (weight: string) => void;
}

export function FontSystemCard({ fontFamily, weightRule, onFontChange, onWeightChange }: FontSystemCardProps) {
  const fonts = [
    { name: "Pretendard", value: "Pretendard" },
    { name: "Noto Sans KR", value: "Noto Sans KR" },
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
  ];

  const weights = [
    { name: "Standard (Adaptive)", value: "standard" },
    { name: "Bold & Heavy", value: "bold" },
    { name: "Light & Elegant", value: "light" },
  ];

  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden h-full flex flex-col">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Type className="w-5 h-5 text-indigo-500" />
          2. 타이포그래피 시스템
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex-1 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">폰트 패밀리 (Font Family)</Label>
            <Select value={fontFamily} onValueChange={onFontChange}>
              <SelectTrigger className="rounded-xl border-gray-100 h-11 bg-gray-50/50">
                <SelectValue placeholder="폰트 선택" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {fonts.map((f) => (
                  <SelectItem key={f.value} value={f.value} className="rounded-lg">
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">무게 중심 (Weight Rule)</Label>
            <Select value={weightRule} onValueChange={onWeightChange}>
              <SelectTrigger className="rounded-xl border-gray-100 h-11 bg-gray-50/50">
                <SelectValue placeholder="무게 규칙 선택" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {weights.map((w) => (
                  <SelectItem key={w.value} value={w.value} className="rounded-lg">
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Font Preview */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Preview</Label>
          <div className="space-y-1">
            <p 
              className="text-2xl font-black tracking-tighter" 
              style={{ fontFamily: fontFamily === "Pretendard" ? "Pretendard, sans-serif" : fontFamily }}
            >
              The quick brown fox
            </p>
            <p 
              className="text-sm text-gray-600 leading-relaxed"
              style={{ fontFamily: fontFamily === "Pretendard" ? "Pretendard, sans-serif" : fontFamily }}
            >
              다람쥐 헌 쳇바퀴에 타고파. 스마트한 쇼핑 경험의 시작, 안목 메일러.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

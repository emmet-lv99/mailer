"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type } from "lucide-react";

interface FontSystemCardProps {
  displayFontFamily: string;
  bodyFontFamily: string;
  weightRule: string;
  onDisplayFontChange: (font: string) => void;
  onBodyFontChange: (font: string) => void;
  onWeightChange: (weight: string) => void;
}

export function FontSystemCard({ 
  displayFontFamily, 
  bodyFontFamily, 
  weightRule, 
  onDisplayFontChange, 
  onBodyFontChange, 
  onWeightChange 
}: FontSystemCardProps) {
  const fonts = [
    { name: "Pretendard", value: "Pretendard" },
    { name: "Noto Sans KR", value: "Noto Sans KR" },
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Montserrat", value: "Montserrat" },
    { name: "Playfair Display", value: "Playfair Display" },
  ];

  const weights = [
    { name: "Standard (Adaptive)", value: "standard" },
    { name: "Bold & Heavy", value: "bold" },
    { name: "Light & Elegant", value: "light" },
  ];

  const getFontStyle = (family: string) => {
    return family === "Pretendard" ? { fontFamily: "Pretendard, sans-serif" } : { fontFamily: family };
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-semibold">디스플레이 폰트 (Headline)</Label>
              <Select value={displayFontFamily} onValueChange={onDisplayFontChange}>
                <SelectTrigger className="rounded-xl border-gray-100 h-11 bg-gray-50/50">
                  <SelectValue placeholder="제목 폰트 선택" />
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
              <Label className="text-xs text-muted-foreground font-semibold">본문 폰트 (Body Text)</Label>
              <Select value={bodyFontFamily} onValueChange={onBodyFontChange}>
                <SelectTrigger className="rounded-xl border-gray-100 h-11 bg-gray-50/50">
                  <SelectValue placeholder="본문 폰트 선택" />
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
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">전체 무게 중심 (Weight Rule)</Label>
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
        <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
          <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Typography Pair Preview</Label>
          <div className="space-y-2">
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <p 
                className="text-2xl font-black tracking-tighter leading-tight" 
                style={getFontStyle(displayFontFamily)}
              >
                The Future of Shopping is Here
              </p>
              <p 
                className="text-lg font-bold text-indigo-600/80" 
                style={getFontStyle(displayFontFamily)}
              >
                안목 메일러가 제안하는 디자인 시스템
              </p>
            </div>
            <p 
              className="text-sm text-gray-600 leading-relaxed indent-1"
              style={getFontStyle(bodyFontFamily)}
            >
              다람쥐 헌 쳇바퀴에 타고파. 스마트한 쇼핑 경험의 시작. 고객의 시선을 사로잡는 최적의 레이아웃과 폰트 조합으로 브랜드의 가치를 높입니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { STANDARD_DESIGN_KEYWORDS } from "@/services/mall/design-keywords";
import { Check, Info } from "lucide-react";

interface DesignKeywordsCardProps {
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

export function DesignKeywordsCard({ selectedKeywords, onKeywordsChange }: DesignKeywordsCardProps) {
  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      onKeywordsChange(selectedKeywords.filter((k) => k !== keyword));
    } else {
      if (selectedKeywords.length >= 5) return; // Limit to 5
      onKeywordsChange([...selectedKeywords, keyword]);
    }
  };

  const categories = [
    { name: "Visual Style", data: STANDARD_DESIGN_KEYWORDS.VISUAL_STYLE },
    { name: "Mood & Tone", data: STANDARD_DESIGN_KEYWORDS.MOOD_TONE },
    { name: "Complexity", data: STANDARD_DESIGN_KEYWORDS.COMPLEXITY },
  ];

  // Filter categories to only include selected keywords
  const filteredCategories = categories.map(cat => ({
    ...cat,
    data: Object.entries(cat.data).filter(([key]) => selectedKeywords.includes(key))
  })).filter(cat => cat.data.length > 0);

  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden h-full flex flex-col">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            1. 확정 디자인 키워드
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({selectedKeywords.length}/5)
            </span>
          </CardTitle>
          <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-full">
            <Info className="w-3 h-3" /> 1단계 분석 결과 반영
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 px-1">
          1단계 채널 분석을 통해 브랜드 정체성에 맞춰 도출된 표준 디자인 키워드입니다.
        </p>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex-1 space-y-6">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div key={category.name} className="space-y-3">
              <Label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                {category.name}
              </Label>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
                {category.data.map(([key, description]) => (
                  <div
                    key={key}
                    className="flex flex-col items-start p-4 text-left rounded-2xl border border-indigo-100 bg-indigo-50/30 shadow-sm relative group"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-sm font-bold uppercase tracking-tight text-indigo-700">
                        {key}
                      </span>
                      <div className="bg-indigo-600 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" strokeWidth={4} />
                      </div>
                    </div>
                    <span className="text-xs text-indigo-600/70 leading-tight">
                      {description.split("(")[0].trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 border-2 border-dashed border-gray-100 rounded-3xl">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
               <Info className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed px-6">
              1단계에서 분석된 키워드가 없습니다.<br/>이전 단계로 돌아가 채널 분석을 먼저 진행해주세요.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

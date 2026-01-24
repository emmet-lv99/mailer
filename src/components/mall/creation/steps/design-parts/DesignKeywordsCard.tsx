"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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

  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden h-full flex flex-col">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            1. 디자인 키워드
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({selectedKeywords.length}/5)
            </span>
          </CardTitle>
          <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-full">
            <Info className="w-3 h-3" /> 표준 사전 V1.0
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 px-1">
          브랜드 정체성을 가장 잘 나타내는 시각 스타일을 2~4개 선택해주세요.
        </p>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex-1 space-y-6 overflow-y-auto max-h-[500px] custom-scrollbar">
        {categories.map((category) => (
          <div key={category.name} className="space-y-3">
            <Label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              {category.name}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(category.data).map(([key, description]) => {
                const isSelected = selectedKeywords.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleKeyword(key)}
                    className={cn(
                      "flex flex-col items-start p-3 text-left rounded-2xl border transition-all duration-300 relative group",
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                        : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-tight",
                        isSelected ? "text-indigo-600" : "text-gray-700"
                      )}>
                        {key}
                      </span>
                      {isSelected && (
                        <div className="bg-indigo-600 rounded-full p-0.5">
                          <Check className="w-2 h-2 text-white" strokeWidth={4} />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 leading-tight">
                      {description.split("(")[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ChannelInputCardProps {
  channelUrl: string;
  referenceUrl: string;
  brandKeywords: string;
  selectedCategories: string[];
  onChannelDataChange: (url: string, refUrl: string, keywords: string, categories: string[]) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const CATEGORIES = [
  { id: 'HEALTH_FOOD', label: '건강식품' },
  { id: 'COSMETICS', label: '화장품/뷰티' },
  { id: 'FASHION', label: '패션/의류' },
  { id: 'ELECTRONICS', label: '전자제품/디지털' },
  { id: 'FOOD', label: '식품/음료' },
  { id: 'LIVING', label: '리빙/홈데코' },
  { id: 'PET', label: '반려동물' },
  { id: 'GENERAL', label: '종합/기타' },
];

export function ChannelInputCard({
  channelUrl,
  referenceUrl,
  brandKeywords,
  selectedCategories,
  onChannelDataChange,
  onAnalyze,
  isLoading
}: ChannelInputCardProps) {
  const [localUrl, setLocalUrl] = useState(channelUrl);
  const [localRefUrl, setLocalRefUrl] = useState(referenceUrl);
  const [localKeywords, setLocalKeywords] = useState(brandKeywords);

  const handleChange = (newUrl: string, newRef: string, newKeys: string) => {
    onChannelDataChange(newUrl, newRef, newKeys, selectedCategories);
  };

  const handleCategoryToggle = (id: string) => {
    let newCategories;
    if (selectedCategories.includes(id)) {
      newCategories = selectedCategories.filter(c => c !== id);
    } else {
      newCategories = [...selectedCategories, id];
    }
    onChannelDataChange(localUrl, localRefUrl, localKeywords, newCategories);
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
                handleChange(e.target.value, localRefUrl, localKeywords);
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
                handleChange(localUrl, e.target.value, localKeywords);
              }}
            />
            <p className="text-[11px] text-slate-400">
              * 입력하신 사이트의 레이아웃 구조를 참고하되, 브랜드 컬러를 입혀서 디자인합니다.
            </p>
          </div>

          {/* Brand Keywords */}
          <div className="space-y-2 md:col-span-2">
             <Label>브랜드 키워드 (Optional)</Label>
             <Input 
               placeholder="예: 신뢰감, 전문성, 친근함 (콤마로 구분)" 
               value={localKeywords}
               onChange={(e) => {
                 setLocalKeywords(e.target.value);
                 handleChange(localUrl, localRefUrl, e.target.value);
               }}
             />
          </div>
        </div>

        {/* 2. Category Selection (Multi-select) */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">판매 예정 상품 카테고리 <span className="text-red-500">*</span> <span className="text-xs font-normal text-slate-500">(중복 선택 가능)</span></Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <div 
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`
                    cursor-pointer rounded-lg border p-4 text-center transition-all hover:bg-slate-50 relative
                    ${isSelected 
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-blue-700 font-bold' 
                      : 'border-slate-200 text-slate-600'}
                  `}
                >
                  {cat.label}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Button 
          className="w-full h-12 text-lg" 
          size="lg" 
          onClick={onAnalyze} 
          disabled={!localUrl || selectedCategories.length === 0 || isLoading}
        >
          {isLoading ? "AI 분석 중... (약 10초)" : "분석 시작하기"}
        </Button>
      </CardContent>
    </Card>
  );
}

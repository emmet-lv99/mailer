"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HERO_BANNER_PRESETS, PRODUCT_PHOTO_PRESETS, VIDEO_THUMBNAIL_PRESETS } from "@/services/mall/image-presets";
import { useMallStore } from "@/services/mall/store";
import { Camera, Check, Film, LayoutTemplate } from "lucide-react";
import { useEffect, useState } from "react";

interface MockupStyleStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function MockupStyleStep({ onNext, onBack }: MockupStyleStepProps) {
  const { mockupStyles, setMockupStyle } = useMallStore();
  const [activeTab, setActiveTab] = useState("product");

  // Local state for immediate feedback
  const [localStyles, setLocalStyles] = useState(mockupStyles);

  useEffect(() => {
    setLocalStyles(mockupStyles);
  }, [mockupStyles]);

  const handleSelect = (category: 'product' | 'hero' | 'thumbnail', id: string) => {
    setLocalStyles(prev => ({ ...prev, [category]: id }));
    setMockupStyle(category, id);
  };

  const tabs = [
    { id: "product", label: "상품 사진", icon: Camera },
    { id: "hero", label: "메인 배너", icon: LayoutTemplate },
    { id: "thumbnail", label: "SNS 썸네일", icon: Film },
  ];

  const getPresetsForTab = (tab: string) => {
    switch (tab) {
      case 'product': return PRODUCT_PHOTO_PRESETS;
      case 'hero': return HERO_BANNER_PRESETS;
      case 'thumbnail': return VIDEO_THUMBNAIL_PRESETS;
      default: return PRODUCT_PHOTO_PRESETS;
    }
  };

  const getCurrentSelectionId = (tab: string) => {
    switch (tab) {
      case 'product': return localStyles.product;
      case 'hero': return localStyles.hero;
      case 'thumbnail': return localStyles.thumbnail;
      default: return localStyles.product;
    }
  };

  const getActivePreset = (tab: string) => {
     const presets = getPresetsForTab(tab);
     const id = getCurrentSelectionId(tab);
     return presets[id] || Object.values(presets)[0];
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="space-y-2 text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">목업 스타일 선택</h2>
        <p className="text-muted-foreground">
          각 컨텐츠 유형별(상품, 배너, SNS) 디자인 스타일을 선택해주세요.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2 text-sm">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => {
            const presets = getPresetsForTab(tab.id);
            const selectedStyleId = getCurrentSelectionId(tab.id);
            const activePreset = getActivePreset(tab.id);

            return (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                 {/* Preset Grid */}
                 <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {Object.values(presets).map((preset) => (
                      <Card 
                        key={preset.id}
                        className={`cursor-pointer transition-all hover:border-blue-500 hover:shadow-md relative overflow-hidden group ${
                          selectedStyleId === preset.id ? "border-blue-600 ring-2 ring-blue-100 bg-blue-50/10" : "border-slate-200"
                        }`}
                        onClick={() => handleSelect(tab.id as any, preset.id)}
                      >
                        {selectedStyleId === preset.id && (
                          <div className="absolute top-0 right-0 p-1 bg-blue-600 rounded-bl-lg z-10">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <CardHeader className="text-center pb-2 pt-4 px-2">
                          <CardTitle className="text-base break-keep leading-tight">{preset.nameKo}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center px-2 pb-4">
                          <p className="text-xs text-muted-foreground break-keep leading-snug line-clamp-2 h-8 flex items-center justify-center">
                            {preset.descriptionKo}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Detail View */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                           <h3 className="font-semibold text-lg">{activePreset?.nameKo}</h3>
                           <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-white border rounded-full font-mono">
                             {activePreset?.id}
                           </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {activePreset?.descriptionKo}
                        </p>
                        <div className="text-xs text-slate-500 space-y-1 mt-2">
                          <p className="font-medium text-slate-700">추천 대상:</p>
                          <div className="flex flex-wrap gap-1">
                            {activePreset?.bestForKo.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-slate-200/50 rounded text-[10px]">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 bg-white rounded-lg border border-slate-200 p-4 relative">
                         <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-mono">PROMPT PREVIEW</div>
                         <div className="text-xs font-mono text-slate-500 overflow-y-auto max-h-[100px] mt-4 whitespace-pre-wrap">
                           {activePreset?.imagenPrompt.trim().slice(0, 350)}...
                         </div>
                      </div>
                    </div>
                  </div>
              </TabsContent>
            );
        })}
      </Tabs>

      <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
        <Button variant="ghost" onClick={onBack} size="lg" className="px-8">
          이전으로
        </Button>
        <Button 
          onClick={onNext} 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 px-12 shadow-md w-full md:w-auto"
        >
          선택 완료 및 다음 단계
        </Button>
      </div>
    </div>
  );
}

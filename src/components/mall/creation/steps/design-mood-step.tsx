"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HERO_BANNER_PRESETS, PRODUCT_PHOTO_PRESETS, VIDEO_THUMBNAIL_PRESETS } from "@/services/mall/image-presets";
import { useMallStore } from "@/services/mall/store";
import { ArrowLeft, ArrowRight, Camera, Check, Film, LayoutTemplate, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DesignKeywordsCard } from "./design-parts/DesignKeywordsCard";

interface DesignMoodStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function DesignMoodStep({ onNext, onBack }: DesignMoodStepProps) {
  const { analysisResult, updateAnalysisResult, mockupStyles, setMockupStyle } = useMallStore();
  const [activeTab, setActiveTab] = useState("product");
  const [localStyles, setLocalStyles] = useState(mockupStyles);

  useEffect(() => {
    setLocalStyles(mockupStyles);
  }, [mockupStyles]);

  if (!analysisResult) return null;

  const design = analysisResult.design;

  // -- Tone & Manner Handlers --
  const updateDesign = (field: string, value: any) => {
    updateAnalysisResult({
      design: { ...design, [field]: value }
    });
  };


  // -- Mockup Style Handlers --
  const handleSelectStyle = (category: 'product' | 'hero' | 'thumbnail', id: string) => {
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

  const previewDesign = {
    ...design,
    concept: {
      ...design.concept,
      mockupStyles: localStyles
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4">
      
      {/* SECTION 1: Tone & Manner */}
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight uppercase tracking-widest">
            Step 3: Image Setting <span className="text-indigo-600">Definition</span>
          </h2>
          <p className="text-muted-foreground">
            브랜드 이미지를 결정하는 무드(키워드, 컬러)와 에셋 스타일을 정의합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <DesignKeywordsCard 
              selectedKeywords={design.concept.keywords || []}
              onKeywordsChange={(keywords) => updateDesign("concept", { ...design.concept, keywords })}
            />
          </div>

          {/* Brand Colors Display */}
          <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden h-full flex flex-col">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-500" />
                Brand Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Primary</label>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: design.foundation.colors.primary }} />
                  <span className="font-mono text-xs font-medium text-slate-600 uppercase">{design.foundation.colors.primary}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Secondary</label>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-lg shadow-sm border border-black/5" style={{ backgroundColor: design.foundation.colors.secondary }} />
                  <span className="font-mono text-xs font-medium text-slate-600 uppercase">{design.foundation.colors.secondary}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full h-px bg-slate-200" />

      {/* SECTION 2: Mockup Styles */}
      <div className="space-y-6">
        <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <Palette className="w-5 h-5 text-indigo-500" />
                목업/에셋 스타일 선택
            </h3>
            <p className="text-sm text-muted-foreground">
                생성될 이미지(상품, 배너, SNS)의 시각적 톤을 설정합니다.
            </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-start mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 h-11 bg-slate-100/80">
                {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-2 text-xs">
                    <tab.icon className="w-3 h-3" />
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
                <TabsContent key={tab.id} value={tab.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Preset Grid */}
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                        {Object.values(presets).map((preset) => (
                        <Card 
                            key={preset.id}
                            className={`cursor-pointer transition-all hover:border-indigo-500 hover:shadow-md relative overflow-hidden group ${
                            selectedStyleId === preset.id ? "border-indigo-600 ring-2 ring-indigo-100 bg-indigo-50/10" : "border-slate-200"
                            }`}
                            onClick={() => handleSelectStyle(tab.id as any, preset.id)}
                        >
                            {selectedStyleId === preset.id && (
                            <div className="absolute top-0 right-0 p-1 bg-indigo-600 rounded-bl-lg z-10">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            )}
                            <CardHeader className="text-center pb-2 pt-4 px-2">
                            <CardTitle className="text-sm break-keep leading-tight font-medium">{preset.nameKo}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center px-2 pb-4">
                            <p className="text-[11px] text-muted-foreground break-keep leading-snug line-clamp-2 h-8 flex items-center justify-center">
                                {preset.descriptionKo}
                            </p>
                            </CardContent>
                        </Card>
                        ))}
                    </div>

                    {/* Detail Preview Box */}
                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 flex flex-col md:flex-row gap-6 text-sm">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">{activePreset?.nameKo}</span>
                                <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 border rounded bg-white">
                                    {activePreset?.id}
                                </span>
                            </div>
                            <p className="text-slate-600">{activePreset?.descriptionKo}</p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {activePreset?.bestForKo.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-500">
                                    {tag}
                                </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 border-l border-slate-200 pl-6 hidden md:block">
                            <p className="text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">AI Prompt Preview</p>
                            <p className="text-xs font-mono text-slate-500 line-clamp-4 leading-relaxed">
                                {activePreset?.imagenPrompt}
                            </p>
                        </div>
                    </div>
                </TabsContent>
                );
            })}
        </Tabs>
      </div>

      <div className="w-full h-px bg-slate-200" />



      <div className="flex justify-between items-center pt-8 pb-12">
        <Button variant="ghost" onClick={onBack} className="flex gap-2">
          <ArrowLeft className="w-4 h-4" /> 이전 단계로
        </Button>
        <Button 
          onClick={async () => {
             if (!design.concept.keywords || design.concept.keywords.length < 2) {
               toast.warning("디자인 키워드를 최소 2개 이상 선택해주세요.");
               return;
             }
             await useMallStore.getState().save();
             onNext();
          }} 
          size="lg"
          className="px-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex gap-2"
        >
          다음 단계: AI 기획 및 구축 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

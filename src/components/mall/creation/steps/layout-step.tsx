"use client";

import { Button } from "@/components/ui/button";
import { HERO_BANNER_PRESETS, PRODUCT_PHOTO_PRESETS, VIDEO_THUMBNAIL_PRESETS } from "@/services/mall/image-presets";
import { useMallStore } from "@/services/mall/store";
import { ArrowLeft, ArrowRight, Camera, Film, LayoutTemplate } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ColorSystemCard } from "./design-parts/ColorSystemCard";
import { FontSystemCard } from "./design-parts/FontSystemCard";
import { LayoutSystemCard } from "./design-parts/LayoutSystemCard";

interface LayoutStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function LayoutStep({ onNext, onBack }: LayoutStepProps) {
  const { analysisResult, updateAnalysisResult, mockupStyles, setMockupStyle } = useMallStore();
  const [activeTab, setActiveTab] = useState("product");
  const [localStyles, setLocalStyles] = useState(mockupStyles);

  useEffect(() => {
    setLocalStyles(mockupStyles);
  }, [mockupStyles]);

  if (!analysisResult) return null;

  const design = analysisResult.design;

  const updateDesign = (field: string, value: any) => {
    updateAnalysisResult({
      design: {
        ...design,
        [field]: value
      }
    });
  };

  const updateFoundation = (field: string, value: any) => {
    updateDesign("foundation", {
      ...design.foundation,
      [field]: value
    });
  };

  const updateColors = (path: string[], value: string) => {
    const newColors = { ...design.foundation.colors };
    if (path.length === 1) {
      (newColors as any)[path[0]] = value;
    } else if (path.length === 2) {
      (newColors as any)[path[0]] = { ...(newColors as any)[path[0]], [path[1]]: value };
    }
    updateFoundation("colors", newColors);
  };

  // -- Merged Logic from DesignMoodStep --
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

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Settings Section */}
      <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight uppercase tracking-widest">
              Step 2: Asset Setting <span className="text-indigo-600">Definition</span>
            </h2>
            <p className="text-muted-foreground">
              웹사이트의 구조(레이아웃)와 기본 디자인 시스템(폰트, 컬러)을 설정합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <LayoutSystemCard 
              layout={design.foundation.shapeLayout}
              onLayoutChange={(field, value) => updateFoundation("shapeLayout", { ...design.foundation.shapeLayout, [field]: value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FontSystemCard 
                  displayFontFamily={design.foundation.typography.displayFontFamily}
                  bodyFontFamily={design.foundation.typography.bodyFontFamily}
                  weightRule={design.foundation.typography.weightRule}
                  onDisplayFontChange={(font) => updateFoundation("typography", { ...design.foundation.typography, displayFontFamily: font })}
                  onBodyFontChange={(font) => updateFoundation("typography", { ...design.foundation.typography, bodyFontFamily: font })}
                  onWeightChange={(weight) => updateFoundation("typography", { ...design.foundation.typography, weightRule: weight })}
                />

                <ColorSystemCard 
                  colors={design.foundation.colors}
                  onColorChange={updateColors}
                />
            </div>
          </div>
      </div>

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

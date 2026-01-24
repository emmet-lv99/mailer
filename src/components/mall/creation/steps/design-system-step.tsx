"use client";

import { Button } from "@/components/ui/button";
import { useMallStore } from "@/services/mall/store";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ColorSystemCard } from "./design-parts/ColorSystemCard";
import { DesignKeywordsCard } from "./design-parts/DesignKeywordsCard";
import { FontSystemCard } from "./design-parts/FontSystemCard";
import { LayoutSystemCard } from "./design-parts/LayoutSystemCard";

interface DesignSystemStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function DesignSystemStep({ onNext, onBack }: DesignSystemStepProps) {
  const { analysisResult, updateAnalysisResult } = useMallStore();

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight uppercase tracking-widest">
          Step 2: Design System <span className="text-indigo-600">Definition</span>
        </h2>
        <p className="text-muted-foreground">
          브랜드의 성격을 담아낼 구조적 설계 원칙(키워드, 타이포, 컬러, 레이아웃)을 정의합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[500px]">
        <DesignKeywordsCard 
          selectedKeywords={design.concept.keywords || []}
          onKeywordsChange={(keywords) => updateDesign("concept", { ...design.concept, keywords })}
        />
        
        <FontSystemCard 
          fontFamily={design.foundation.typography.fontFamily}
          weightRule={design.foundation.typography.weightRule}
          onFontChange={(font) => updateFoundation("typography", { ...design.foundation.typography, fontFamily: font })}
          onWeightChange={(weight) => updateFoundation("typography", { ...design.foundation.typography, weightRule: weight })}
        />

        <ColorSystemCard 
          colors={design.foundation.colors}
          onColorChange={updateColors}
        />

        <LayoutSystemCard 
          layout={design.foundation.shapeLayout}
          onLayoutChange={(field, value) => updateFoundation("shapeLayout", { ...design.foundation.shapeLayout, [field]: value })}
        />
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
          다음 단계: 레퍼런스 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

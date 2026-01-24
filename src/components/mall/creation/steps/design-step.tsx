"use client";

import { Button } from "@/components/ui/button";
import { useMallStore } from "@/services/mall/store";
import { useState } from "react";
import { toast } from "sonner";
import { DesignContextSidebar } from "./design-parts/DesignContextSidebar";
import { DesignControlPanel } from "./design-parts/DesignControlPanel";
import { DesignSidebar, StepID } from "./design-parts/DesignSidebar";
import { DesignVariantGrid } from "./design-parts/DesignVariantGrid";

interface DesignStepProps {
  onBack: () => void;
}

export function DesignStep({ onBack }: DesignStepProps) {
  const { 
    analysisResult, 
    referenceAnalysis, 
    designVariants, 
    selectedDesigns, 
    setDesignVariants, 
    selectDesign,
    generationStatus,
    setGenerationStatus
  } = useMallStore();
 
  const [currentStepId, setCurrentStepId] = useState<StepID>('MAIN_PC');
  const [completedSteps, setCompletedSteps] = useState<StepID[]>([]);
  const [activeArchetypeKey, setActiveArchetypeKey] = useState<string | null>(null);

  const getCurrentStepConfig = (id: StepID) => {
    const configs: Record<StepID, { label: string; description: string }> = {
      'MAIN_PC': { label: 'Main Page (PC)', description: '쇼핑몰의 첫인상을 결정하는 메인 페이지 디자인을 생성합니다.' },
      'DETAIL_PC': { label: 'Detail Page (PC)', description: '상품의 매력을 보여주는 상세 페이지 디자인을 생성합니다.' },
      'LIST_PC': { label: 'List Page (PC)', description: '상품들을 한눈에 볼 수 있는 목록 페이지 디자인을 생성합니다.' },
      'MAIN_MOBILE': { label: 'Main Page (Mobile)', description: '모바일 환경에 최적화된 메인 페이지 디자인을 생성합니다.' },
      'DETAIL_MOBILE': { label: 'Detail Page (Mobile)', description: '모바일 환경에 최적화된 상세 페이지 디자인을 생성합니다.' },
      'LIST_MOBILE': { label: 'List Page (Mobile)', description: '모바일 환경에 최적화된 목록 페이지 디자인을 생성합니다.' },
    };
    return configs[id];
  };

  const handleGenerate = async () => {
    setGenerationStatus('generating');
    
    try {
      // 1. Prompt Engineering Stage (Refine via Gemini)
      toast.loading("기획안을 바탕으로 최적의 프롬프트를 생성 중입니다...", { id: "refine-prompt" });
      
      const refineRes = await fetch("/api/youtube/mall/design/refine-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          analysisResult, 
          referenceAnalysis, 
          pageType: currentStepId 
        }),
      });

      if (!refineRes.ok) throw new Error("Prompt refinement failed");
      const { refinedPrompt, archetypeKey } = await refineRes.json();
      
      setActiveArchetypeKey(archetypeKey);
      toast.success(`[${archetypeKey} 스타일] 프롬프트 최적화 완료!`, { id: "refine-prompt" });

      // 2. Image Generation Stage (Imagen 4)
      let referenceImage = null;
      if (currentStepId === 'DETAIL_PC') referenceImage = selectedDesigns['MAIN_PC'];
      else if (currentStepId === 'LIST_PC') referenceImage = selectedDesigns['DETAIL_PC'] || selectedDesigns['MAIN_PC'];
      else if (currentStepId === 'MAIN_MOBILE') referenceImage = selectedDesigns['MAIN_PC'];
      else if (currentStepId === 'DETAIL_MOBILE') referenceImage = selectedDesigns['DETAIL_PC'];
      else if (currentStepId === 'LIST_MOBILE') referenceImage = selectedDesigns['LIST_PC'];

      const response = await fetch("/api/youtube/mall/design/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: refinedPrompt, 
          pageType: currentStepId,
          referenceImage,
          aspect_ratio: "9:16",
          number_of_images: 3,
          archetype: archetypeKey // [LOG] Pass for tracking
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const { images } = await response.json();
      setDesignVariants(currentStepId, images);
      toast.success(`${getCurrentStepConfig(currentStepId).label} 시안이 생성되었습니다!`);
    } catch (error) {
      console.error(error);
      toast.error("시안 생성 중 오류가 발생했습니다.", { id: "refine-prompt" });
    } finally {
      setGenerationStatus('idle');
    }
  };

  const handleNextStep = () => {
    // Mark current as completed
    if (!completedSteps.includes(currentStepId)) {
      setCompletedSteps(prev => [...prev, currentStepId]);
    }

    // Move to next step
    const steps: StepID[] = ['MAIN_PC', 'DETAIL_PC', 'LIST_PC', 'MAIN_MOBILE', 'DETAIL_MOBILE', 'LIST_MOBILE'];
    const currentIndex = steps.indexOf(currentStepId);
    if (currentIndex < steps.length - 1) {
      setCurrentStepId(steps[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.success("모든 시안 제작이 완료되었습니다!");
      // Final completion logic (redirect or final view)
    }
  };

  const config = getCurrentStepConfig(currentStepId);

  return (
    <div className="flex h-[calc(100vh-180px)] border rounded-3xl overflow-hidden bg-white shadow-2xl border-slate-100">
      <DesignSidebar 
        currentStepId={currentStepId} 
        completedSteps={completedSteps} 
        onStepSelect={setCurrentStepId} 
      />

      <div className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden relative">
        <DesignControlPanel 
          label={config.label}
          description={config.description}
          onGenerate={handleGenerate}
          onNext={handleNextStep}
          onBack={onBack}
          isLoading={generationStatus === 'generating'}
          hasSelection={!!selectedDesigns[currentStepId]}
          hasVariants={!!designVariants[currentStepId]}
        />

        <div className="flex-1 p-8 overflow-y-auto">
          <DesignVariantGrid 
            variants={designVariants[currentStepId] || []}
            selectedImage={selectedDesigns[currentStepId] || null}
            onSelect={(img) => selectDesign(currentStepId, img)}
            isLoading={generationStatus === 'generating'}
          />
          
          <div className="h-20" /> {/* Bottom Spacing */}
        </div>
        
        {/* Navigation Footer */}
        <div className="p-4 border-t bg-white flex justify-between items-center shadow-inner">
           <Button variant="ghost" onClick={onBack} className="text-slate-400">이전 단계로</Button>
           <p className="text-[10px] text-slate-300 font-mono">STEP 3 :: IMAGEN 4 TURBO ENGINE</p>
        </div>
      </div>

      <DesignContextSidebar 
        analysisResult={analysisResult} 
        referenceAnalysis={referenceAnalysis} 
      />
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMallStore } from "@/services/mall/store";
import { ArrowRight, BrainCircuit, RefreshCcw, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DesignContextSidebar } from "./design-parts/DesignContextSidebar";
import { DesignSidebar, StepID } from "./design-parts/DesignSidebar";

interface PromptStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PromptStep({ onNext, onBack }: PromptStepProps) {
  const analysisResult = useMallStore(state => state.analysisResult);
  const referenceAnalysis = useMallStore(state => state.referenceAnalysis);
  const refinedPrompts = useMallStore(state => state.refinedPrompts);
  const setRefinedPrompt = useMallStore(state => state.setRefinedPrompt);
  
  // Debug log to trace store updates
  console.log('[PromptStep] Render - refinedPrompts:', refinedPrompts);

  const [currentStepId, setCurrentStepId] = useState<StepID>('MAIN_PC');
  const [isRefining, setIsRefining] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<StepID[]>([]);

  const getCurrentStepConfig = (id: StepID) => {
    const configs: Record<StepID, { label: string; description: string }> = {
      'MAIN_PC': { label: 'Main Page (PC)', description: '메인 페이지를 위한 이미지 생성 프롬프트를 최적화합니다.' },
      'DETAIL_PC': { label: 'Detail Page (PC)', description: '상세 페이지를 위한 이미지 생성 프롬프트를 최적화합니다.' },
      'LIST_PC': { label: 'List Page (PC)', description: '목록 페이지를 위한 이미지 생성 프롬프트를 최적화합니다.' },
      'MAIN_MOBILE': { label: 'Main Page (Mobile)', description: '모바일 메인 페이지를 위한 프롬프트를 최적화합니다.' },
      'DETAIL_MOBILE': { label: 'Detail Page (Mobile)', description: '모바일 상세 페이지를 위한 프롬프트를 최적화합니다.' },
      'LIST_MOBILE': { label: 'List Page (Mobile)', description: '모바일 목록 페이지를 위한 프롬프트를 최적화합니다.' },
    };
    return configs[id];
  };

  const handleRefine = async () => {
    setIsRefining(true);
    toast.loading("AI가 디자인 전략을 바탕으로 정교한 프롬프트를 작성 중입니다...", { id: "refine-prompt" });

    try {
      const response = await fetch("/api/youtube/mall/design/refine-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          analysisResult, 
          referenceAnalysis, 
          pageType: currentStepId 
        }),
      });

      if (!response.ok) throw new Error("Prompt refinement failed");
      const { refinedPrompt } = await response.json();
      
      setRefinedPrompt(currentStepId, refinedPrompt);
      console.log('[PromptStep] Updated store with:', refinedPrompt);
      
      if (!completedSteps.includes(currentStepId)) {
        setCompletedSteps(prev => [...prev, currentStepId]);
      }
      toast.success("프롬프트 최적화 완료!", { id: "refine-prompt" });
    } catch (error) {
      console.error(error);
      toast.error("프롬프트 생성 중 오류가 발생했습니다.", { id: "refine-prompt" });
    } finally {
      setIsRefining(false);
    }
  };

  const handleNextInFlow = () => {
     const steps: StepID[] = ['MAIN_PC', 'DETAIL_PC', 'LIST_PC', 'MAIN_MOBILE', 'DETAIL_MOBILE', 'LIST_MOBILE'];
     const currentIndex = steps.indexOf(currentStepId);
     if (currentIndex < steps.length - 1) {
       setCurrentStepId(steps[currentIndex + 1]);
     } else {
       onNext();
     }
  };

  const currentPrompt = refinedPrompts[currentStepId] || "";
  const config = getCurrentStepConfig(currentStepId);

  return (
    <div className="flex h-[calc(100vh-180px)] border rounded-3xl overflow-hidden bg-white shadow-2xl border-slate-100">
      <DesignSidebar 
        currentStepId={currentStepId} 
        completedSteps={completedSteps} 
        onStepSelect={setCurrentStepId} 
      />

      <div className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden relative">
        {/* Header Section */}
        <div className="p-6 border-b bg-white flex justify-between items-center">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600">
                        <BrainCircuit className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">{config.label}</h2>
                </div>
                <p className="text-xs text-slate-400 font-medium">{config.description}</p>
            </div>
            
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefine}
                    disabled={isRefining}
                    className="rounded-xl border-slate-200 hover:bg-slate-50 gap-2 h-10 px-4"
                >
                    <RefreshCcw className={cn("w-4 h-4", isRefining && "animate-spin")} />
                    {currentPrompt ? "AI 다시 생성" : "AI 자동 생성"}
                </Button>
                <Button 
                    size="sm" 
                    onClick={handleNextInFlow}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 gap-2 h-10 px-5"
                >
                    다음 단계
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>

        {/* Prompt Editor Area */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
            <div className="flex-1 min-h-[400px] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Optimized Visual Prompt (Imagen 4)</label>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                         <Wand2 className="w-3 h-3" />
                         Refined by Gemini 2.0 Flash
                    </div>
                </div>
                
                {currentPrompt ? (
                    <Textarea 
                        value={currentPrompt}
                        onChange={(e) => setRefinedPrompt(currentStepId, e.target.value)}
                        placeholder="AI가 생성한 프롬프트를 확인하고 수정할 수 있습니다."
                        className="flex-1 font-mono text-sm leading-relaxed p-6 rounded-2xl border-slate-200 focus-visible:ring-indigo-500 bg-white shadow-sm resize-none"
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white gap-4 text-slate-300">
                         <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                            <BrainCircuit className="w-8 h-8 opacity-20" />
                         </div>
                         <div className="text-center space-y-1">
                            <p className="text-sm font-semibold text-slate-400">프롬프트가 아직 생성되지 않았습니다</p>
                            <p className="text-xs">상단의 'AI 자동 생성' 버튼을 클릭해 주세요</p>
                         </div>
                         <Button onClick={handleRefine} variant="secondary" className="mt-2 rounded-xl">프롬프트 생성하기</Button>
                    </div>
                )}
            </div>

            {/* Help Card */}
            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                <h4 className="text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                    💡 전문가 팁
                </h4>
                <p className="text-[11px] text-indigo-700 leading-normal opacity-80">
                    생성된 프롬프트는 AI가 이미지 4 하드웨어 성능을 최대로 끌어내기 위해 기술적으로 최적화한 문장입니다. 
                    특정 오브젝트를 추가하거나 분위기를 미세하게 조정하고 싶을 때만 영문으로 내용을 수정해 주세요.
                </p>
            </div>
        </div>

        {/* Navigation Footer */}
        <div className="p-4 border-t bg-white flex justify-between items-center shadow-inner">
           <Button variant="ghost" onClick={onBack} className="text-slate-400">이전 단계로</Button>
           <p className="text-[10px] text-slate-300 font-mono">STEP 4 :: VISUAL PROMPT ENGINEERING</p>
        </div>
      </div>

      <DesignContextSidebar 
        analysisResult={analysisResult} 
        referenceAnalysis={referenceAnalysis} 
      />
    </div>
  );
}

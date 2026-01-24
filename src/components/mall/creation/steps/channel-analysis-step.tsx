"use client";

import { Button } from "@/components/ui/button";
import { findProjectsByUrl } from "@/services/mall/project";
import { useMallStore } from "@/services/mall/store";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Sub-components
import { MallProjectAnalysis } from "@/services/mall/types";
import { ChannelInputCard } from "./analysis-parts/ChannelInputCard";
import { DesignConceptCard } from "./analysis-parts/DesignConceptCard";
import { DuplicateCheckDialog } from "./analysis-parts/DuplicateCheckDialog";
import { MarketingStrategyCard } from "./analysis-parts/MarketingStrategyCard";

interface ChannelAnalysisStepProps {
  onNext: () => void;
}

export function ChannelAnalysisStep({ onNext }: ChannelAnalysisStepProps) {
  const { 
    channelUrl, 
    competitors, 
    analysisResult, 
    setChannelData, 
    setAnalysisResult,
    loadProject,
    updateAnalysisResult
  } = useMallStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [existingProjects, setExistingProjects] = useState<any[]>([]);

  // New State for Selectors
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // selectedAges and brandKeywords removed from Input phase.
  const [selectedAges, setSelectedAges] = useState<string[]>([]); 
  const [referenceUrl, setReferenceUrl] = useState<string>("");
  // const [brandKeywords, setBrandKeywords] = useState<string>(""); // Removed state

  const startAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/youtube/mall/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass all new inputs to backend
        body: JSON.stringify({ 
           channelUrl, 
           productCategories: selectedCategories, 
           // targetAge removed
           referenceUrl,
           // brandKeywords removed
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data: MallProjectAnalysis = await response.json();
      setAnalysisResult(data);
      
      toast.success("채널 분석이 완료되었습니다!");
    } catch (error) {
      toast.error("분석 중 오류가 발생했습니다. URL을 확인해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeWithCheck = async () => {
    if (!channelUrl) {
       toast.error("URL을 입력해주세요.");
       return;
    }
    if (selectedCategories.length === 0) {
       toast.error("상품 카테고리를 하나 이상 선택해주세요.");
       return;
    }
    
    // Normalize URL
    const normalizedUrl = channelUrl.trim().replace(/\/$/, "");

    try {
      const projects = await findProjectsByUrl(normalizedUrl);
      if (projects && projects.length > 0) {
        setExistingProjects(projects);
        setShowConfirmDialog(true);
        toast.info("기존 분석 기록이 발견되었습니다.");
        return;
      }
    } catch (e) {
      console.warn("Failed to check existing projects:", e);
    }

    await startAnalysis();
  };

  const updateMarketing = (field: string, value: any) => {
    if (!analysisResult) return;
    updateAnalysisResult({
      marketing: {
        ...analysisResult.marketing,
        [field]: value
      }
    });
  };

  const updateDesign = (field: string, value: any) => {
    if (!analysisResult) return;
    updateAnalysisResult({
      design: {
        ...analysisResult.design,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DuplicateCheckDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onStartFresh={() => {
          setShowConfirmDialog(false);
          startAnalysis();
        }}
        onLoadExisting={(project) => {
          loadProject(project);
          setShowConfirmDialog(false);
          toast.success("이전 분석 결과를 성공적으로 가져왔습니다.");
        }}
        existingProjects={existingProjects}
        url={channelUrl}
      />

      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">유튜브 채널 분석</h2>
        <p className="text-muted-foreground">
          운영 중인 유튜브 채널 URL을 입력하면, AI가 브랜드 컨셉을 분석해드립니다.
        </p>
      </div>

      <ChannelInputCard
        channelUrl={channelUrl}
        referenceUrl={referenceUrl}
        selectedCategories={selectedCategories}
        onChannelDataChange={(url, refUrl, cats) => {
           setChannelData(url, []);
           setReferenceUrl(refUrl);
           // setBrandKeywords removed
           setSelectedCategories(cats);
        }}
        onAnalyze={handleAnalyzeWithCheck}
        isLoading={isLoading}
      />

      {analysisResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">{analysisResult.channelName} 분석 결과</h2>
              <p className="text-muted-foreground">AI가 도출한 맞춤형 쇼핑몰 전략입니다.</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isEditing ? "default" : "outline"} 
                size="sm" 
                onClick={() => {
                  if (isEditing) toast.success("수정 사항이 임시 저장되었습니다.");
                  setIsEditing(!isEditing);
                }}
                className="flex gap-2"
              >
                {isEditing ? <><Check className="w-4 h-4" /> 완료</> : <><Pencil className="w-4 h-4" /> 수정하기</>}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <MarketingStrategyCard
              analysisResult={analysisResult}
              isEditing={isEditing}
              updateMarketing={updateMarketing}
            />
            <DesignConceptCard
              analysisResult={analysisResult}
              isEditing={isEditing}
              updateDesign={updateDesign}
            />
          </div>

          <div className="flex justify-end pt-4 pb-12">
            <Button 
              onClick={async () => {
                await useMallStore.getState().save();
                onNext();
              }} 
              size="lg"
              className="px-12 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100"
            >
              기획안 최종 확정 및 다음 단계로
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

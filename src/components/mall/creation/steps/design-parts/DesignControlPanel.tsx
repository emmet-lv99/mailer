"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";

interface DesignControlPanelProps {
  label: string;
  description: string;
  onGenerate: () => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  hasSelection: boolean;
  hasVariants: boolean;
}

export function DesignControlPanel({ 
  label, 
  description, 
  onGenerate, 
  onNext, 
  onBack, 
  isLoading, 
  hasSelection,
  hasVariants
}: DesignControlPanelProps) {
  return (
    <div className="p-6 border-b bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-10 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          {label}
        </h2>
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        {hasVariants && !isLoading && (
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onGenerate}
            className="flex-1 md:flex-none gap-2 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            다시 생성
          </Button>
        )}
        
        {!hasVariants && (
          <Button 
            size="lg" 
            onClick={onGenerate} 
            disabled={isLoading}
            className="flex-1 md:flex-none gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"
          >
            {isLoading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 생성 중...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> AI 시안 생성 시작</>
            )}
          </Button>
        )}

        {hasSelection && (
          <Button 
            size="lg" 
            onClick={onNext}
            className="flex-1 md:flex-none gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          >
            선택 완료 및 다음 단계
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

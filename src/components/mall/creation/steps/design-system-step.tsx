"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Settings2 } from "lucide-react";

interface DesignSystemStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function DesignSystemStep({ onNext, onBack }: DesignSystemStepProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight uppercase">Step 2: Design System Definition</h2>
        <p className="text-muted-foreground">
          브랜드의 성격을 담아낼 구조적 설계 원칙(그리드, 타이포, 레이아웃)을 정의합니다.
        </p>
      </div>

      <Card className="border-none shadow-xl bg-indigo-900 text-white rounded-3xl overflow-hidden relative min-h-[400px] flex items-center justify-center">
        <CardContent className="text-center space-y-6 relative z-10 px-12">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/10">
            <Settings2 className="w-10 h-10 text-indigo-200" />
          </div>
          <h3 className="text-2xl font-bold">Awaiting Design System Parameters</h3>
          <p className="text-indigo-200 max-w-md mx-auto leading-relaxed">
            인원님께서 전달해 주실 구체적인 디자인 시스템 정의 사항을 기다리고 있습니다. 
            상세 내용이 확보되면 여기에 정교한 설정 컨트롤러와 AI 매핑 로직이 구현될 예정입니다.
          </p>
        </CardContent>
        <div className="absolute right-[-10%] top-[-10%] opacity-5 pointer-events-none">
          <Settings2 className="w-[500px] h-[500px] transform rotate-12" />
        </div>
      </Card>

      <div className="flex justify-between items-center pt-8">
        <Button variant="ghost" onClick={onBack} className="flex gap-2">
          <ArrowLeft className="w-4 h-4" /> 이전 단계로
        </Button>
        <Button 
          onClick={onNext} 
          size="lg"
          className="px-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex gap-2"
        >
          다음 단계: 레퍼런스 <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

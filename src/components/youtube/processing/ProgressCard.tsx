"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Download, LayoutTemplate, List, Loader2, Mail, RefreshCw } from "lucide-react";

interface Log {
  message: string;
  type: "info" | "success" | "warning" | "error"; 
  timestamp: string;
}

interface ProgressCardProps {
  status: "running" | "completed" | "error";
  progress: number;
  channelsCount: number;
  resultsCount: number;
  errorMessage: string;
  savingDrafts: boolean;
  onDownload: () => void;
  onTemplateSelect: () => void;
  onRawSave: () => void;
  onViewList: () => void;
  onBack: () => void;
}

export function ProgressCard({
  status,
  progress,
  channelsCount,
  resultsCount,
  errorMessage,
  savingDrafts,
  onDownload,
  onTemplateSelect,
  onRawSave,
  onViewList,
  onBack
}: ProgressCardProps) {
  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">
          {status === "running" ? "AI가 열심히 일하고 있어요 🤖" : 
           status === "completed" ? "작업 완료! 🎉" : "오류 발생 🚨"}
        </CardTitle>
        <CardDescription>
          총 {channelsCount}개 채널 중 {resultsCount}개 처리 완료
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative pt-4 px-4">
          <Progress value={progress} className="h-4" />
          <p className="text-center mt-2 font-mono font-bold text-lg">{progress}%</p>
        </div>
        
        {status === "completed" && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 mt-8">
            <CheckCircle className="w-20 h-20 text-green-500" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {/* 1. Download */}
              <Button size="lg" variant="outline" onClick={onDownload} className="h-24 text-lg flex flex-col gap-2">
                <Download className="w-8 h-8 opacity-50" /> 
                CSV 다운로드
              </Button>
              
              {/* 2. Template Save */}
              <Button size="lg" variant="secondary" onClick={onTemplateSelect} disabled={savingDrafts} className="h-24 text-lg flex flex-col gap-2 relative overflow-hidden">
                {savingDrafts ? (
                   <><Loader2 className="w-8 h-8 animate-spin" /> 저장 중...</>
                ) : (
                   <><LayoutTemplate className="w-8 h-8 opacity-50" /> 템플릿 적용 저장</>
                )}
                <div className="text-xs font-normal opacity-70">모든 결과에 템플릿 적용</div>
              </Button>

              {/* 3. Raw Save */}
              <Button size="lg" onClick={onRawSave} disabled={savingDrafts} className="h-24 text-lg flex flex-col gap-2">
                {savingDrafts ? (
                   <><Loader2 className="w-8 h-8 animate-spin" /> 저장 중...</>
                ) : (
                   <><Mail className="w-8 h-8 opacity-50" /> 이메일만 저장</>
                )}
                 <div className="text-xs font-normal opacity-70 text-white/80">템플릿 없이 본문만</div>
              </Button>
            </div>

            <div className="w-full pt-4 border-t">
              <Button variant="ghost" className="w-full" onClick={onViewList}>
                   <List className="mr-2 h-4 w-4" /> 결과 목록 상세보기 ({resultsCount}건)
              </Button>
            </div>
          </div>
        )}
        
        {status === "error" && (
          <div className="flex justify-center flex-col items-center gap-4 text-destructive">
            <AlertTriangle className="w-12 h-12" />
            <p>{errorMessage}</p>
            <Button variant="outline" onClick={onBack}>
              <RefreshCw className="mr-2 w-4 h-4" /> 다시 시도
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

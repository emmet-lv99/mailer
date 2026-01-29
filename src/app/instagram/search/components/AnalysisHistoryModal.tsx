"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { History, Lightbulb, RefreshCw, RotateCcw } from "lucide-react";

interface AnalysisHistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    username: string;
    analyzedDate: string | null;
    onLoad: () => void;
    onRefresh: () => void;
}

export function AnalysisHistoryModal({
    open,
    onOpenChange,
    username,
    analyzedDate,
    onLoad,
    onRefresh
}: AnalysisHistoryModalProps) {
    // Format date nicely
    const formattedDate = analyzedDate 
        ? new Date(analyzedDate).toLocaleDateString() 
        : "알 수 없음";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <History className="w-6 h-6 text-blue-600" />
                        기존 분석 이력 발견
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-base text-foreground/80">
                        <span className="font-semibold text-foreground">@{username}</span>님에 대한 분석 결과가 이미 존재합니다.<br/>
                        (최근 분석일: {formattedDate})
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-4 my-2">
                    <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                            <p className="font-semibold text-blue-700 dark:text-blue-400 text-sm">
                                추천
                            </p>
                            <p className="text-sm text-blue-600/90 dark:text-blue-300/90 leading-relaxed">
                                DB에 저장된 리포트를 즉시 불러오면 <span className="font-bold">대기 시간 없이</span> 바로 확인할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2 mt-4">
                     <Button 
                        variant="outline" 
                        onClick={onRefresh}
                        className="w-full sm:flex-1 h-12"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        새로 분석하기 (30초 소요)
                    </Button>
                    <Button 
                        onClick={onLoad}
                        className="w-full sm:flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        기존 리포트 불러오기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

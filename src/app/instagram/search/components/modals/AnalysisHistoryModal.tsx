import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { History, RefreshCw } from "lucide-react";

interface AnalysisHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadHistory: () => void;
  onNewAnalysis: () => void;
  username: string;
  date: string;
}

export function AnalysisHistoryModal({
  isOpen,
  onClose,
  onLoadHistory,
  onNewAnalysis,
  username,
  date,
}: AnalysisHistoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            기존 분석 이력 발견
          </DialogTitle>
          <DialogDescription>
            <strong>@{username}</strong>님에 대한 분석 결과가 이미 존재합니다.<br />
            (최근 분석일: {new Date(date).toLocaleDateString()})
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 border border-blue-100">
            <p className="font-semibold mb-1">💡 추천</p>
            DB에 저장된 리포트를 즉시 불러오면 <strong>대기 시간 없이</strong> 바로 확인할 수 있습니다.
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
           <Button 
            variant="outline" 
            onClick={onNewAnalysis} 
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            새로 분석하기 (30초 소요)
          </Button>
          <Button 
            onClick={onLoadHistory} 
            className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <History className="w-4 h-4" />
            기존 리포트 불러오기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

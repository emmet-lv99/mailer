"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface DuplicateCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartFresh: () => void;
  onLoadExisting: (project: any) => void;
  existingProjects: any[];
  url: string;
}

export function DuplicateCheckDialog({
  open,
  onOpenChange,
  onStartFresh,
  onLoadExisting,
  existingProjects,
  url
}: DuplicateCheckDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="text-blue-500">기존 분석 기록이 있습니다</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            이 채널({url})로 분석된 기록이 총 <strong>{existingProjects.length}건</strong> 발견되었습니다.<br /><br />
            이전 결과를 불러와서 시간을 절약하시겠습니까, 아니면 완전히 새롭게 분석하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onStartFresh}>새로 분석하기</AlertDialogCancel>
          <AlertDialogAction onClick={() => onLoadExisting(existingProjects[0])}>
            이전 결과 불러오기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

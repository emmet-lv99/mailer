"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AnalysisRefreshConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function AnalysisRefreshConfirmModal({
    open,
    onOpenChange,
    onConfirm
}: AnalysisRefreshConfirmModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>최신 데이터를 다시 수집하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                        이 작업은 유료 API 크레딧을 소모합니다.<br/>
                        정말로 진행하시겠습니까?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => {
                        e.preventDefault();
                        onConfirm();
                    }} className="bg-red-600 hover:bg-red-700 text-white">
                        확인 (API 사용)
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

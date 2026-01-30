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
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Proposal } from "../types";

interface ProposalDialogsProps {
  // Add Dialog
  isAddOpen: boolean;
  onAddOpenChange: (open: boolean) => void;
  onAdd: (data: { instagram_id: string; followers: number }) => void;

  // Content Dialog
  selectedProposal: Proposal | null;
  onContentOpenChange: (open: boolean) => void;
  onSaveContent: (content: string) => void;

  // Delete Dialog
  deleteId: number | null;
  onDeleteOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
}

export function ProposalDialogs({
  isAddOpen,
  onAddOpenChange,
  onAdd,
  selectedProposal,
  onContentOpenChange,
  onSaveContent,
  deleteId,
  onDeleteOpenChange,
  onConfirmDelete,
}: ProposalDialogsProps) {
  // Local state for forms
  const [newProposalData, setNewProposalData] = useState({ instagram_id: "", followers: "" });
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (selectedProposal) {
      setEditContent(selectedProposal.content);
    }
  }, [selectedProposal]);

  const handleAdd = () => {
    onAdd({
      instagram_id: newProposalData.instagram_id,
      followers: parseInt(newProposalData.followers) || 0
    });
    setNewProposalData({ instagram_id: "", followers: "" });
  };

  return (
    <>
      {/* Add Proposal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={onAddOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>새 제안 추가</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right text-sm font-medium">Instagram ID</span>
              <Input
                placeholder="아이디 입력"
                className="col-span-3"
                value={newProposalData.instagram_id}
                onChange={(e) => setNewProposalData({ ...newProposalData, instagram_id: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right text-sm font-medium">Follower</span>
              <Input
                type="number"
                placeholder="팔로워 수"
                className="col-span-3"
                value={newProposalData.followers}
                onChange={(e) => setNewProposalData({ ...newProposalData, followers: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onAddOpenChange(false)}>취소</Button>
            <Button onClick={handleAdd} disabled={!newProposalData.instagram_id.trim()}>추가하기</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={!!selectedProposal} onOpenChange={(open) => !open && onContentOpenChange(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <span className="text-primary">@{selectedProposal?.instagram_id}</span>
              님에게 보낸 제안 내용
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Textarea 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[300px] leading-relaxed text-sm bg-muted/30 focus-visible:ring-primary"
              placeholder="제안 내용을 입력하세요..."
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => onSaveContent(editContent)} className="gap-2">
              <Save className="h-4 w-4" />
              저장하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && onDeleteOpenChange(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>제안 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 이 제안을 삭제하시겠습니까? 삭제된 제안은 다시 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-red-600 hover:bg-red-700">
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

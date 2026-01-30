"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Check, Edit2, ExternalLink, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Proposal } from "../types";

interface ProposalTableRowProps {
  item: Proposal;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDelete: () => void;
  onViewContent: () => void;
  onUpdateMemo: (memo: string) => void;
  onToggleSent: () => void;
  onToggleReaction: () => void;
  onSaveRow: (data: { instagram_id: string; followers: number }) => void;
  no: number;
}

export function ProposalTableRow({
  item,
  isSelected,
  onToggleSelect,
  onDelete,
  onViewContent,
  onUpdateMemo,
  onToggleSent,
  onToggleReaction,
  onSaveRow,
  no,
}: ProposalTableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    instagram_id: item.instagram_id, 
    followers: item.followers 
  });
  const [localMemo, setLocalMemo] = useState(item.memo);

  useEffect(() => {
    setLocalMemo(item.memo);
  }, [item.memo]);

  const handleStartEdit = () => {
    setEditData({ instagram_id: item.instagram_id, followers: item.followers });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onSaveRow(editData);
    setIsEditing(false);
  };

  return (
    <TableRow className="group">
      <TableCell>
        <Checkbox 
          aria-label={`${item.instagram_id} 선택`} 
          checked={isSelected}
          onCheckedChange={onToggleSelect}
        />
      </TableCell>
      <TableCell className="w-[50px] text-center text-xs text-muted-foreground font-medium">
        {no}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            value={editData.instagram_id}
            onChange={(e) => setEditData({ ...editData, instagram_id: e.target.value })}
            className="h-8 text-sm"
          />
        ) : (
          <div className="flex flex-col">
            <span className="font-medium">{item.instagram_id}</span>
            <a 
              href={`https://instagram.com/${item.instagram_id}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5"
            >
              프로필 보기 <ExternalLink className="w-2 h-2" />
            </a>
          </div>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editData.followers}
            onChange={(e) => setEditData({ ...editData, followers: parseInt(e.target.value) || 0 })}
            className="h-8 text-sm"
          />
        ) : (
          <span className="text-sm font-medium">{item.followers.toLocaleString()}</span>
        )}
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </TableCell>
      <TableCell>
        <Badge 
          variant={item.is_sent ? "default" : "secondary"} 
          className="text-[10px] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onToggleSent}
        >
          {item.is_sent ? "Sent" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-xs text-muted-foreground">
          {item.sent_at ? new Date(item.sent_at).toLocaleDateString() : "-"}
        </span>
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={`text-[10px] capitalize cursor-pointer hover:opacity-80 transition-all ${
            item.reaction === 'accept' ? 'bg-green-50 text-green-700 border-green-200' :
            item.reaction === 'refuse' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-gray-50 text-gray-600 border-gray-200'
          }`}
          onClick={onToggleReaction}
        >
          {item.reaction}
        </Badge>
      </TableCell>
      <TableCell>
        <p 
          className="text-sm truncate max-w-[200px] cursor-pointer hover:text-primary transition-colors" 
          onClick={onViewContent}
        >
          {item.content || <span className="text-muted-foreground italic text-xs">내용 없음</span>}
        </p>
      </TableCell>
      <TableCell>
        <Input 
          value={localMemo} 
          onChange={(e) => setLocalMemo(e.target.value)}
          onBlur={() => {
            if (localMemo !== item.memo) {
              onUpdateMemo(localMemo);
            }
          }}
          className="h-8 text-xs bg-transparent border-transparent hover:border-input focus:border-input transition-all"
          placeholder="메모를 입력하세요..."
        />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={handleStartEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

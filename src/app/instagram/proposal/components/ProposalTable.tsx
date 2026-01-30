"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { Proposal, SortConfig, SortKey } from "../types";
import { ProposalTableRow } from "./ProposalTableRow";

interface ProposalTableProps {
  data: Proposal[];
  loading: boolean;
  selectedIds: number[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: number) => void;
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
  onDeleteRow: (id: number) => void;
  onViewContent: (item: Proposal) => void;
  onMemoChange: (id: number, memo: string) => void;
  onToggleSent: (id: number) => void;
  onToggleReaction: (id: number) => void;
  onSaveRow: (id: number, data: { instagram_id: string; followers: number }) => void;
}

export function ProposalTable({
  data,
  loading,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  sortConfig,
  onSort,
  onDeleteRow,
  onViewContent,
  onMemoChange,
  onToggleSent,
  onToggleReaction,
  onSaveRow,
}: ProposalTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]">
            <Checkbox 
              aria-label="전체 선택" 
              checked={data.length > 0 && selectedIds.length === data.length}
              onCheckedChange={onToggleSelectAll}
            />
          </TableHead>
          <TableHead className="w-[50px] text-center">No</TableHead>
          <TableHead className="w-[180px]">Instagram ID</TableHead>
          <TableHead className="w-[100px]">Follower</TableHead>
          <TableHead 
            className="w-[120px] cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onSort('created_at')}
          >
            <div className="flex items-center gap-1">
              Created At
              <ArrowUpDown className={`h-3 w-3 ${sortConfig.key === 'created_at' ? 'text-primary' : 'text-muted-foreground/50'}`} />
            </div>
          </TableHead>
          <TableHead className="w-[80px]">Sent</TableHead>
          <TableHead 
            className="w-[120px] cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onSort('sent_at')}
          >
            <div className="flex items-center gap-1">
              Sent At
              <ArrowUpDown className={`h-3 w-3 ${sortConfig.key === 'sent_at' ? 'text-primary' : 'text-muted-foreground/50'}`} />
            </div>
          </TableHead>
          <TableHead className="w-[100px]">Reaction</TableHead>
          <TableHead>Content</TableHead>
          <TableHead className="w-[180px]">Memo</TableHead>
          <TableHead className="text-right w-[100px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={11} className="h-32 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
              검색 결과가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, index) => (
            <ProposalTableRow 
              key={item.id}
              item={item}
              no={data.length - index}
              isSelected={selectedIds.includes(item.id)}
              onToggleSelect={() => onToggleSelectRow(item.id)}
              onDelete={() => onDeleteRow(item.id)}
              onViewContent={() => onViewContent(item)}
              onUpdateMemo={(memo) => onMemoChange(item.id, memo)}
              onToggleSent={() => onToggleSent(item.id)}
              onToggleReaction={() => onToggleReaction(item.id)}
              onSaveRow={(editData) => onSaveRow(item.id, editData)}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}

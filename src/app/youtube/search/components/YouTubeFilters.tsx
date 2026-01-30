"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Users } from "lucide-react";

interface YouTubeFiltersProps {
  filterType: string;
  setFilterType: (type: string) => void;
  minSubs: string;
  setMinSubs: (val: string) => void;
  maxSubs: string;
  setMaxSubs: (val: string) => void;
  onReset: () => void;
}

export function YouTubeFilters({
  filterType,
  setFilterType,
  minSubs,
  setMinSubs,
  maxSubs,
  setMaxSubs,
  onReset,
}: YouTubeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 p-3 rounded-lg border border-border/50">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-1">상태 필터:</span>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px] h-8 text-xs bg-background">
            <SelectValue placeholder="필터 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 채널 보기</SelectItem>
            <SelectItem value="sendable">전송 가능 목록</SelectItem>
            <SelectItem value="sent">발송됨 목록</SelectItem>
            <SelectItem value="unsuitable">부적합 목록</SelectItem>
          </SelectContent>
        </Select>

        {(filterType !== "all" || minSubs || maxSubs) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-primary transition-colors ml-1"
            onClick={onReset}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            초기화
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-md border shadow-sm ml-auto">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground mr-1">구독자 수:</span>
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            placeholder="Min"
            value={minSubs}
            onChange={(e) => setMinSubs(e.target.value)}
            className="w-24 h-7 text-xs border-none bg-muted/50 focus-visible:ring-0 focus-visible:bg-muted transition-colors"
          />
          <span className="text-muted-foreground text-[10px]">~</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxSubs}
            onChange={(e) => setMaxSubs(e.target.value)}
            className="w-24 h-7 text-xs border-none bg-muted/50 focus-visible:ring-0 focus-visible:bg-muted transition-colors"
          />
        </div>
        <span className="text-[10px] text-muted-foreground ml-1">명</span>
      </div>
    </div>
  );
}

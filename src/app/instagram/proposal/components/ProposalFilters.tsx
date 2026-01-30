"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";

interface ProposalFiltersProps {
  filters: string[];
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  minFollowers: string;
  setMinFollowers: (val: string) => void;
  maxFollowers: string;
  setMaxFollowers: (val: string) => void;
}

export function ProposalFilters({ 
  filters, 
  toggleFilter, 
  clearFilters,
  minFollowers,
  setMinFollowers,
  maxFollowers,
  setMaxFollowers
}: ProposalFiltersProps) {
  const filterOptions = [
    { id: 'sent', label: '보낸 목록 (Sent)', variant: 'default' } as const,
    { id: 'draft', label: '전송할 목록 (Draft)', variant: 'secondary' } as const,
    { id: 'accept', label: '수락 목록 (Accept)', color: 'bg-green-100 text-green-700' },
    { id: 'refuse', label: '거절 목록 (Refuse)', color: 'bg-red-100 text-red-700' },
    { id: 'pending', label: '대기 목록 (Pending)', color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 p-3 rounded-lg border border-border/50">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-1">상태 필터:</span>
        {filterOptions.map((f) => (
          <Badge
            key={f.id}
            variant={(f as any).variant || (filters.includes(f.id) ? "default" : "outline")}
            className={`cursor-pointer px-3 py-1 transition-all hover:scale-105 ${
              filters.includes(f.id) 
                ? "" 
                : "bg-background text-muted-foreground hover:bg-accent"
            } ${filters.includes(f.id) && f.color ? f.color : ""}`}
            onClick={() => toggleFilter(f.id)}
          >
            {f.label}
          </Badge>
        ))}
        {(filters.length > 0 || minFollowers || maxFollowers) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs text-muted-foreground hover:text-primary transition-colors ml-1"
            onClick={clearFilters}
          >
            초기화
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-md border shadow-sm ml-auto">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground mr-1">팔로워 수:</span>
        <div className="flex items-center gap-1.5">
          <Input 
            type="number" 
            placeholder="Min" 
            value={minFollowers}
            onChange={(e) => setMinFollowers(e.target.value)}
            className="w-20 h-7 text-xs border-none bg-muted/50 focus-visible:ring-0 focus-visible:bg-muted transition-colors"
          />
          <span className="text-muted-foreground text-[10px]">~</span>
          <Input 
            type="number" 
            placeholder="Max" 
            value={maxFollowers}
            onChange={(e) => setMaxFollowers(e.target.value)}
            className="w-20 h-7 text-xs border-none bg-muted/50 focus-visible:ring-0 focus-visible:bg-muted transition-colors"
          />
        </div>
        <span className="text-[10px] text-muted-foreground ml-1">명</span>
      </div>
    </div>
  );
}

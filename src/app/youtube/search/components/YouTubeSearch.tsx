"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface YouTubeSearchProps {
  query: string;
  setQuery: (val: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export function YouTubeSearch({ query, setQuery, onSearch, loading }: YouTubeSearchProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="grid gap-2 flex-1 w-full">
          <label className="text-sm font-medium">검색어</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="예: 요리, 게임, 브이로그"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <Button onClick={onSearch} disabled={loading} className="w-full md:w-auto self-end">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "검색"}
        </Button>
      </div>
    </Card>
  );
}

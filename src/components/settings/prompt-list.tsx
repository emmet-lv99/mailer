
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Plus } from "lucide-react";
import useSWR from "swr";

export interface Prompt {
  id: number;
  title: string;
  content: string;
  is_default: boolean;
  created_at: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface PromptListProps {
  selectedId: number | null;
  onSelect: (prompt: Prompt | null) => void;
  onRefresh?: () => void;
}

export function PromptList({ selectedId, onSelect }: PromptListProps) {
  const { data: prompts, error, mutate } = useSWR<Prompt[]>("/api/prompts", fetcher);

  if (error) return <div className="text-red-500 text-sm">로딩 에러</div>;
  if (!prompts) return <div className="text-muted-foreground text-sm">로딩 중...</div>;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">프롬프트 목록</h2>
        <Button size="sm" onClick={() => onSelect(null)}>
          <Plus className="mr-2 h-4 w-4" /> 새로 만들기
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {Array.isArray(prompts) && prompts.map((prompt) => (
          <Card
            key={prompt.id}
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted/50",
              selectedId === prompt.id && "border-primary bg-muted/30"
            )}
            onClick={() => onSelect(prompt)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium truncate">
                  {prompt.title}
                </CardTitle>
                {prompt.is_default && (
                  <span className="flex items-center text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    <Check className="mr-1 h-3 w-3" /> 기본
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {prompt.content}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2 text-right">
                {new Date(prompt.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}

        {prompts.length === 0 && (
          <div className="text-center text-muted-foreground py-10 text-sm">
            등록된 프롬프트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

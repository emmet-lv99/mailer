"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { STANDARD_DESIGN_KEYWORDS } from "@/services/mall/design-keywords";
import { Check } from "lucide-react";

interface KeywordSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

export function KeywordSelectionDialog({
  open,
  onOpenChange,
  selectedKeywords,
  onKeywordsChange,
}: KeywordSelectionDialogProps) {
  const categories = [
    { name: "Visual Style", data: STANDARD_DESIGN_KEYWORDS.VISUAL_STYLE },
    { name: "Mood & Tone", data: STANDARD_DESIGN_KEYWORDS.MOOD_TONE },
    { name: "Complexity", data: STANDARD_DESIGN_KEYWORDS.COMPLEXITY },
  ];

  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      onKeywordsChange(selectedKeywords.filter((k) => k !== keyword));
    } else {
      onKeywordsChange([...selectedKeywords, keyword]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2 bg-white">
          <DialogTitle className="text-2xl font-black uppercase tracking-tight">디자인 키워드 추가</DialogTitle>
          <p className="text-xs text-muted-foreground">브랜드 정체성을 가장 잘 나타내는 표준 키워드를 선택하거나 제외하세요.</p>
        </DialogHeader>

        <div className="flex-1 p-6 pt-2 overflow-y-auto custom-scrollbar">
          <div className="space-y-8 pb-8">
            {categories.map((category) => (
              <div key={category.name} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{category.name}</span>
                  <div className="h-[1px] flex-1 bg-indigo-50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(category.data).map(([key, description]) => {
                    const isSelected = selectedKeywords.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleKeyword(key)}
                        className={cn(
                          "flex flex-col items-start p-4 text-left rounded-2xl border transition-all duration-300 relative group overflow-hidden",
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                            : "border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                        )}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={cn(
                            "text-sm font-bold uppercase tracking-tight",
                            isSelected ? "text-indigo-700" : "text-gray-700"
                          )}>
                            {key}
                          </span>
                          {isSelected && (
                            <div className="bg-indigo-600 rounded-full p-1 shadow-sm animate-in zoom-in-50 duration-300">
                              <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                            </div>
                          )}
                        </div>
                        <span className={cn(
                          "text-[11px] leading-relaxed transition-colors",
                          isSelected ? "text-indigo-600/70" : "text-gray-400"
                        )}>
                          {description.split("(")[0].trim()}
                        </span>
                        
                        {/* Selected Indicator Background */}
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600/5 rounded-full -mr-8 -mt-8" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
           <div className="flex flex-wrap gap-1.5 max-w-[70%]">
              {selectedKeywords.map(k => (
                <Badge key={k} variant="secondary" className="bg-indigo-600 text-white border-none py-1 h-6">
                  {k}
                </Badge>
              ))}
              {selectedKeywords.length === 0 && <span className="text-xs text-gray-400 italic">선택된 키워드가 없습니다.</span>}
           </div>
           <Button onClick={() => onOpenChange(false)} className="rounded-xl px-8 h-12 bg-indigo-600 hover:bg-indigo-700 font-bold">확인</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

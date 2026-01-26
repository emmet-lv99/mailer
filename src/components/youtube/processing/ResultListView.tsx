"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";

interface ResultListViewProps {
  results: any[];
  onViewModeChange: () => void;
  onOpenPreview: (result: any) => void;
}

export function ResultListView({ results, onViewModeChange, onOpenPreview }: ResultListViewProps) {
  return (
    <Card className="animate-in fade-in slide-in-from-right-10 duration-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">생성된 이메일 상세 목록 ({results.length})</CardTitle>
          <CardDescription>각 항목을 클릭하여 수정 및 개별 저장할 수 있습니다.</CardDescription>
        </div>
        <Button variant="outline" onClick={onViewModeChange}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 뒤로가기
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {results.map((result, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between items-center w-full pr-4">
                  <span className="font-bold truncate max-w-[200px] text-left">{result.channelName}</span>
                  <span className="text-sm text-gray-500 truncate max-w-[300px] hidden md:block">{result.subject}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/10 p-4 rounded-md space-y-4">
                <div className="text-sm border-l-4 border-primary pl-4 py-2 bg-white rounded shadow-sm">
                  <p className="font-bold mb-1">Subject</p>
                  <p className="mb-4">{result.subject}</p>
                  <p className="font-bold mb-1">Body Preview</p>
                  <p className="whitespace-pre-wrap text-gray-700 break-keep">{result.body}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" onClick={() => onOpenPreview(result)}>
                    <Edit className="mr-2 h-4 w-4" /> 편집 및 템플릿 적용
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

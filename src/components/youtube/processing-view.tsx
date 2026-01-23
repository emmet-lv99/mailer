"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmailPreviewDialog } from "@/components/youtube/email-preview-dialog";
import { TemplateSelectDialog } from "@/components/youtube/template-select-dialog";
import { mailerService } from "@/services/youtube/mailer";
import { processorService } from "@/services/youtube/processor";
import { AlertTriangle, ArrowLeft, CheckCircle, Download, Edit, LayoutTemplate, List, Loader2, Mail, RefreshCw } from "lucide-react";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ProcessingViewProps {
  promptContent: string;
  channels: any[];
  onBack: () => void;
}

interface Log {
  message: string;
  type: "info" | "success" | "warning" | "error"; 
  timestamp: string;
}

export function ProcessingView({ promptContent, channels, onBack }: ProcessingViewProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<Log[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [status, setStatus] = useState<"running" | "completed" | "error">("running");
  const [errorMessage, setErrorMessage] = useState("");
  
  // View/Page Mode
  const [viewMode, setViewMode] = useState<"progress" | "list">("progress");

  // State for Saving Drafts (Batch)
  const [isSelectOpen, setIsSelectOpen] = useState(false); // For Template Save
  const [savingDrafts, setSavingDrafts] = useState(false);

  // State for Single Preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: Log["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { message, type, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    let active = true;
    const abortController = new AbortController();

    const startProcess = async () => {
      try {
        addLog("작업을 시작합니다...", "info");
        
        const reader = await processorService.start({ promptContent, channels });
        const decoder = new TextDecoder();

        while (active) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.replace("data: ", "");
                const data = JSON.parse(jsonStr);

                if (data.type === "progress") {
                  const percent = Math.round((data.current / data.total) * 100);
                  setProgress(percent);
                } else if (data.type === "log") {
                    addLog(data.message, data.message.includes("❌") ? "error" : "info");
                } else if (data.type === "result") {
                    setResults((prev) => [...prev, data]);
                }
              } catch (e) {
                // ignore json parse error for partial chunks
              }
            }
          }
        }
        
        if (active) {
            setStatus("completed");
            addLog("모든 작업이 완료되었습니다!", "success");
        }
      } catch (error: any) {
        if (active) {
            setStatus("error");
            setErrorMessage(error.message);
            addLog(`작업 중단: ${error.message}`, "error");
        }
      }
    };

    startProcess();

    return () => {
      active = false;
      abortController.abort();
    };
  }, []); // Run once on mount

  const handleDownload = () => {
    if (results.length === 0) {
        toast.error("다운로드할 결과가 없습니다.");
        return;
    }
    
    // Convert to CSV
    const csvData = results.map(r => ({
        "Channel ID": r.channelId || "",
        "채널명": r.channelName || "Unknown",
        "Email": r.email || "",
        "구독자수": r.subscribers || "0",
        "이메일 제목": r.subject || "제목 없음",
        "이메일 본문": r.body || "내용 없음"
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `anmok_result_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for actual saving logic
  const executeSaveDrafts = async (selection: { headerTemplateId: number | null; footerTemplateId: number | null } | null) => {
    if (results.length === 0) {
      toast.error("저장할 결과가 없습니다.");
      return;
    }

    setSavingDrafts(true);
    let successCount = 0;
    let failCount = 0;

    const toastId = toast.loading("Gmail 임시보관함에 저장 중...", { duration: 100000 });

    try {
      for (const result of results) {
        try {
          await mailerService.saveDraft({
              subject: result.subject,
              body: result.body,
              headerTemplateId: selection?.headerTemplateId || null,
              footerTemplateId: selection?.footerTemplateId || null,
              recipientEmail: result.email || "",
              channelId: result.channelId,
              channelName: result.channelName, 
          });

          successCount++;
        } catch (e) {
          failCount++;
        }
      }

      toast.dismiss(toastId);
      if (failCount === 0) {
        toast.success(`총 ${successCount}건이 Gmail 임시보관함에 저장되었습니다! 📨`);
      } else {
        toast.warning(`${successCount}건 성공, ${failCount}건 실패했습니다.`);
      }
    } catch (e) {
      toast.dismiss(toastId);
      toast.error("저장 중 오류가 발생했습니다.");
    } finally {
      setSavingDrafts(false);
    }
  };

  // 1. Template Save (Batch)
  const handleTemplateSaveDrafts = (selection: { headerTemplateId: number | null; footerTemplateId: number | null }) => {
    setIsSelectOpen(false);
    executeSaveDrafts(selection);
  };

  // 2. Raw Save (Batch)
  const handleRawSaveDrafts = () => {
    if (!confirm("템플릿 없이 AI가 작성한 본문 그대로 저장하시겠습니까?")) return;
    executeSaveDrafts(null);
  };

  // Single Item Logic (Existing)
  const openPreview = (result: any) => {
    setSelectedResult(result);
    setPreviewOpen(true);
  };

  const handleSaveSingleConfig = async (subject: string, body: string, templateId: number | null) => {
    const loadingToast = toast.loading("저장 중...");
    try {
        await mailerService.saveDraft({
              subject,
              body,
              templateId,
              recipientEmail: selectedResult.email || "", 
        });

        toast.success("Gmail 초안 저장 성공!");
    } catch (e: any) {
        toast.error(`저장 중 오류가 발생했습니다: ${e.message}`);
    } finally {
        toast.dismiss(loadingToast);
    }
  };

  // --- Sub Views ---

  const ResultListView = () => (
    <Card className="animate-in fade-in slide-in-from-right-10 duration-500">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-xl">생성된 이메일 상세 목록 ({results.length})</CardTitle>
                <CardDescription>각 항목을 클릭하여 수정 및 개별 저장할 수 있습니다.</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setViewMode("progress")}>
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
                                <Button size="sm" onClick={() => openPreview(result)}>
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

  if (viewMode === "list") {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <ResultListView />
            {/* Single Preview Dialog (Available in list view) */}
            {selectedResult && (
                <EmailPreviewDialog
                    open={previewOpen}
                    onOpenChange={setPreviewOpen}
                    defaultSubject={selectedResult.subject}
                    defaultBody={selectedResult.body}
                    recipientEmail={selectedResult.email}
                    onSaveConfig={handleSaveSingleConfig}
                />
            )}
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Card */}
      <Card>
        <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">
                {status === "running" ? "AI가 열심히 일하고 있어요 🤖" : 
                 status === "completed" ? "작업 완료! 🎉" : "오류 발생 🚨"}
            </CardTitle>
            <CardDescription>
                총 {channels.length}개 채널 중 {results.length}개 처리 완료
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="relative pt-4 px-4">
                <Progress value={progress} className="h-4" />
                <p className="text-center mt-2 font-mono font-bold text-lg">{progress}%</p>
            </div>
            
            {status === "completed" && (
                <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500 mt-8">
                    <CheckCircle className="w-20 h-20 text-green-500" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                      {/* 1. Download */}
                      <Button size="lg" variant="outline" onClick={handleDownload} className="h-24 text-lg flex flex-col gap-2">
                          <Download className="w-8 h-8 opacity-50" /> 
                          CSV 다운로드
                      </Button>
                      
                      {/* 2. Template Save */}
                      <Button size="lg" variant="secondary" onClick={() => setIsSelectOpen(true)} disabled={savingDrafts} className="h-24 text-lg flex flex-col gap-2 relative overflow-hidden">
                          {savingDrafts ? (
                             <><Loader2 className="w-8 h-8 animate-spin" /> 저장 중...</>
                          ) : (
                             <><LayoutTemplate className="w-8 h-8 opacity-50" /> 템플릿 적용 저장</>
                          )}
                          <div className="text-xs font-normal opacity-70">모든 결과에 템플릿 적용</div>
                      </Button>

                      {/* 3. Raw Save */}
                      <Button size="lg" onClick={handleRawSaveDrafts} disabled={savingDrafts} className="h-24 text-lg flex flex-col gap-2">
                          {savingDrafts ? (
                             <><Loader2 className="w-8 h-8 animate-spin" /> 저장 중...</>
                          ) : (
                             <><Mail className="w-8 h-8 opacity-50" /> 이메일만 저장</>
                          )}
                           <div className="text-xs font-normal opacity-70 text-white/80">템플릿 없이 본문만</div>
                      </Button>
                    </div>

                    <div className="w-full pt-4 border-t">
                        <Button variant="ghost" className="w-full" onClick={() => setViewMode("list")}>
                             <List className="mr-2 h-4 w-4" /> 결과 목록 상세보기 ({results.length}건)
                        </Button>
                    </div>
                </div>
            )}
            
            {status === "error" && (
                <div className="flex justify-center flex-col items-center gap-4 text-destructive">
                    <AlertTriangle className="w-12 h-12" />
                    <p>{errorMessage}</p>
                    <Button variant="outline" onClick={onBack}>
                        <RefreshCw className="mr-2 w-4 h-4" /> 다시 시도
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Logs Terminal (Only show in Progress view) */}
      <Card className="bg-black text-green-400 font-mono text-sm h-[300px] flex flex-col border-gray-800 shadow-2xl">
        <div className="p-3 border-b border-gray-800 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-gray-500">processing-logs</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                    <span className="text-gray-500">[{log.timestamp}]</span>
                    <span className={
                        log.type === "error" ? "text-red-400" :
                        log.type === "success" ? "text-blue-400 font-bold" :
                        "text-green-400"
                    }>
                        {log.message}
                    </span>
                </div>
            ))}
            <div ref={logEndRef} />
        </div>
      </Card>
      
      {status === "completed" && (
        <div className="text-center">
            <Button variant="link" onClick={onBack}>처음으로 돌아가기</Button>
        </div>
      )}
      
      {/* Batch Select Dialog */}
      <TemplateSelectDialog 
        open={isSelectOpen} 
        onOpenChange={setIsSelectOpen} 
        onSelect={handleTemplateSaveDrafts} 
      />
    </div>
  );
}

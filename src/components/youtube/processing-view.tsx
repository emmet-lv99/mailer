"use client";

import { Button } from "@/components/ui/button";
import { EmailPreviewDialog } from "@/components/youtube/email-preview-dialog";
import { LogsTerminal } from "@/components/youtube/processing/LogsTerminal";
import { ProgressCard } from "@/components/youtube/processing/ProgressCard";
import { ResultListView } from "@/components/youtube/processing/ResultListView";
import { TemplateSelectDialog } from "@/components/youtube/template-select-dialog";
import { mailerService } from "@/services/youtube/mailer";
import { processorService } from "@/services/youtube/processor";
import Papa from "papaparse";
import { useEffect, useState } from "react";
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
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [savingDrafts, setSavingDrafts] = useState(false);

  // State for Single Preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  const addLog = (message: string, type: Log["type"] = "info") => {
    setLogs((prev) => [
      ...prev,
      { message, type, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

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
  }, []);

  const handleDownload = () => {
    if (results.length === 0) {
        toast.error("다운로드할 결과가 없습니다.");
        return;
    }
    
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

  const handleTemplateSaveDrafts = (selection: { headerTemplateId: number | null; footerTemplateId: number | null }) => {
    setIsSelectOpen(false);
    executeSaveDrafts(selection);
  };

  const handleRawSaveDrafts = () => {
    if (!confirm("템플릿 없이 AI가 작성한 본문 그대로 저장하시겠습니까?")) return;
    executeSaveDrafts(null);
  };

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

  if (viewMode === "list") {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <ResultListView 
              results={results} 
              onViewModeChange={() => setViewMode("progress")} 
              onOpenPreview={openPreview} 
            />
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
      <ProgressCard
        status={status}
        progress={progress}
        channelsCount={channels.length}
        resultsCount={results.length}
        errorMessage={errorMessage}
        savingDrafts={savingDrafts}
        onDownload={handleDownload}
        onTemplateSelect={() => setIsSelectOpen(true)}
        onRawSave={handleRawSaveDrafts}
        onViewList={() => setViewMode("list")}
        onBack={onBack}
      />

      <LogsTerminal logs={logs} />
      
      {status === "completed" && (
        <div className="text-center">
            <Button variant="link" onClick={onBack}>처음으로 돌아가기</Button>
        </div>
      )}
      
      <TemplateSelectDialog 
        open={isSelectOpen} 
        onOpenChange={setIsSelectOpen} 
        onSelect={handleTemplateSaveDrafts} 
      />
    </div>
  );
}

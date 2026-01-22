
"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";
// I'll use standard div with overflow-y-auto.
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Download, RefreshCw } from "lucide-react";
import Papa from "papaparse";
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
        
        const response = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptContent, channels }),
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(response.statusText || "서버 연결 실패");
        }

        const reader = response.body.getReader();
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
    // Map result object to headers
    const csvData = results.map(r => ({
        "채널명(ID)": r.channelName || r.channelId || "Unknown",
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
                <div className="flex justify-center flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <Button size="lg" onClick={handleDownload} className="w-64 text-lg">
                        <Download className="mr-2 w-5 h-5" /> 결과 다운로드
                    </Button>
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

      {/* Logs Terminal */}
      <Card className="bg-black text-green-400 font-mono text-sm h-[400px] flex flex-col border-gray-800 shadow-2xl">
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
    </div>
  );
}

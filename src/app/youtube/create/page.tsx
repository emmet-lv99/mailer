"use client";

import { FileDropzone } from "@/components/common/file-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessingView } from "@/components/youtube/processing-view";
import { AlertCircle, Play, Settings } from "lucide-react";
import Link from "next/link";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  // --- States ---
  const [channelFile, setChannelFile] = useState<File | null>(null);
  const [historyFile, setHistoryFile] = useState<File | null>(null);
  
  const [channelData, setChannelData] = useState<any[]>([]);
  const [skipIds, setSkipIds] = useState<Set<string>>(new Set());

  const [channelCount, setChannelCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProps, setProcessingProps] = useState<{
    promptContent: string;
    channels: any[];
  } | null>(null);

  // const [apiKeyMissing, setApiKeyMissing] = useState(false); // Removed
  
  // Fetch default prompt
  const { data: prompts } = useSWR("/api/prompts?type=YOUTUBE", fetcher);
  const defaultPrompt = Array.isArray(prompts) ? prompts.find((p: any) => p.is_default) : null;

  // --- Effects ---
  // useEffect(() => {
  //   const key = localStorage.getItem("GEMINI_API_KEY");
  //   setApiKeyMissing(!key);
  // }, []);

  // --- Handlers ---
  const handleChannelFile = (file: File) => {
    setChannelFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setChannelData(results.data);
        setChannelCount(results.data.length);
      },
    });
  };

  const handleHistoryFile = (file: File) => {
    setHistoryFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const successes = new Set<string>();
        results.data.forEach((row: any) => {
            // Check for success criteria
            if (row['이메일 제목'] && row['이메일 제목'] !== '생성 실패') {
                if (row['채널명']) successes.add(row['채널명']);
                if (row['channelName']) successes.add(row['channelName']);
            }
        });
        setSkipIds(successes);
        setHistoryCount(successes.size);
      },
    });
  };

  const handleStart = () => {
    if (!channelFile) return toast.error("채널 리스트 파일을 업로드해주세요.");
    if (!defaultPrompt) return toast.error("설정에서 기본 프롬프트를 활성화해주세요.");

    // Filter channels
    const channelsToProcess = channelData.filter((ch: any) => {
        const name = ch.channelName || ch.채널명 || "";
        return !skipIds.has(name);
    });

    if (channelsToProcess.length === 0) {
        toast.info("모든 채널이 이미 완료되었습니다!");
        return;
    }

    setProcessingProps({
        promptContent: defaultPrompt.content,
        channels: channelsToProcess
    });
    setIsProcessing(true);
  };

  // --- Render Processing View ---
  if (isProcessing && processingProps) {
      return (
          <div className="container mx-auto p-6 min-h-screen">
              <ProcessingView 
                {...processingProps} 
                onBack={() => setIsProcessing(false)} 
              />
          </div>
      );
  }

  // --- Render Main View ---
  return (
    <div className="container mx-auto p-6 max-h-screen flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">유튜브 메일러</h1>
            <p className="text-muted-foreground">
            유튜브 채널을 분석하고 맞춤형 제안 메일을 생성합니다.
            </p>
        </div>
        <Link href="/youtube/settings">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> 설정
          </Button>
        </Link>
      </header>
      
      {!defaultPrompt && prompts && (
        <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 p-4 rounded-lg flex items-center gap-2 border border-yellow-500/20">
            <AlertCircle className="w-5 h-5" />
            <div>
                <span className="font-semibold">프롬프트 미설정:</span> 
                {' '}설정 페이지에서 사용할 프롬프트를 '기본값'으로 체크해주세요.
            </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Step 1: Upload Channel List */}
        <Card>
            <CardHeader>
                <CardTitle>1. 채널 리스트 업로드</CardTitle>
                <CardDescription>
                    작업할 유튜브 채널 ID가 포함된 CSV 파일을 업로드하세요.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FileDropzone 
                    label="채널 리스트 (input.csv)" 
                    selectedFile={channelFile}
                    onFileSelect={handleChannelFile}
                    onFileRemove={() => { setChannelFile(null); setChannelCount(0); setChannelData([]); }}
                    required
                />
                {channelCount > 0 && (
                     <div className="mt-4 text-sm text-green-600 font-medium flex items-center">
                        <span className="bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded mr-2">
                             {channelCount}개 채널
                        </span>
                        감지됨
                     </div>
                )}
            </CardContent>
        </Card>

        {/* Step 2: Upload History (Optional) */}
        <Card>
            <CardHeader>
                <CardTitle>2. 이어하기 (선택)</CardTitle>
                <CardDescription>
                    기존 작업 파일(output_emails.csv)이 있다면 업로드하세요.
                    <br/>완료된 채널은 건너뛰고 나머지 작업만 수행합니다.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FileDropzone 
                    label="기존 작업 파일 (output.csv)" 
                    selectedFile={historyFile}
                    onFileSelect={handleHistoryFile}
                    onFileRemove={() => { setHistoryFile(null); setHistoryCount(0); setSkipIds(new Set()); }}
                />
                 {historyCount > 0 && (
                     <div className="mt-4 text-sm text-blue-600 font-medium flex items-center">
                        <span className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded mr-2">
                             {historyCount}개 완료됨
                        </span>
                        확인됨 (건너뜀)
                     </div>
                )}
            </CardContent>
        </Card>
      </div>

      {/* Action Footer */}
      <div className="flex justify-center mt-8">
        <Button 
            size="lg" 
            disabled={!channelFile || !defaultPrompt}
            onClick={handleStart}
            className="w-full md:w-auto px-12 text-lg h-14"
        >
            <Play className="mr-2 h-5 w-5" /> 
            {historyCount > 0 
                ? `${Math.max(0, channelCount - historyCount)}개 채널에 대해 작업 시작` 
                : "이메일 작성 시작"
            }
        </Button>
      </div>
      
      {/* Help Text */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        * 시작 버튼을 누르면 작업 화면으로 전환됩니다.
      </p>
    </div>
  );
}

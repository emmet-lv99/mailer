
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { historyService } from "@/services/history/api";
import { CheckCircle, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function HistoryImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setUploading(true);
    
    try {
      const data = await historyService.importHistory(file);
      toast.success(`${data.count}건의 발송 이력을 성공적으로 가져왔습니다!`);
      setFile(null);
    } catch (error: any) {
      toast.error(`Import 실패: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>과거 발송 이력 가져오기 (Legacy Import)</CardTitle>
          <CardDescription>
            기존에 발송했던 CSV 파일을 업로드하여 시스템에 이력을 등록합니다.<br/>
            이미 발송된 채널은 시스템이 자동으로 감지하여 중복 발송을 방지합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange} 
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground mt-2">
              * CSV 파일에는 <code>Channel ID</code> 컬럼이 반드시 포함되어야 합니다.
            </p>
          </div>

          <Button onClick={handleImport} disabled={!file || uploading}>
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                DB로 가져오기
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
           <p className="font-bold">팁: CSV 파일 형식</p>
           <p>헤더에 <code>Channel ID</code> (또는 <code>id</code>), <code>Channel Name</code> (또는 <code>Title</code>) 컬럼이 있으면 자동으로 인식됩니다.</p>
        </div>
      </div>
    </div>
  );
}


"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ApiKeyConfig() {
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("GEMINI_API_KEY");
    if (stored) {
      setHasKey(true);
      setKey(stored);
    }
  }, []);

  const handleSave = () => {
    if (!key.trim()) {
      toast.error("API Key를 입력해주세요.");
      return;
    }
    if (!key.startsWith("AIza")) {
      toast.warning("유효하지 않은 Google API Key 형식인 것 같습니다. (AIza...로 시작)");
    }
    
    localStorage.setItem("GEMINI_API_KEY", key.trim());
    setHasKey(true);
    toast.success("Gemini API Key가 저장되었습니다.");
  };

  const handleClear = () => {
    localStorage.removeItem("GEMINI_API_KEY");
    setKey("");
    setHasKey(false);
    toast.info("API Key가 삭제되었습니다.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
            <Key className="w-5 h-5 mr-2" />
            AI 모델 설정
        </CardTitle>
        <CardDescription>
          Google Gemini API Key를 입력하세요. 이 키는 서버에 저장되지 않고 브라우저에만 저장됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="AIza..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button onClick={handleSave}>저장</Button>
          {hasKey && (
            <Button variant="outline" onClick={handleClear}>
              삭제
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
            * 사용 모델: <span className="font-mono bg-muted px-1 rounded">gemini-2.0-flash</span>
        </p>
      </CardContent>
    </Card>
  );
}

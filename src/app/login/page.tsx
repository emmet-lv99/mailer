"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error === "AccessDenied") {
      toast.error("접근 권한이 없는 계정입니다. 관리자에게 문의하세요.");
    }
  }, [error]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Anmok Hunter</CardTitle>
          <CardDescription>
            서비스 이용을 위해 구글 계정으로 로그인해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button 
            className="w-full flex items-center gap-2 py-6 text-base" 
            variant="outline"
            onClick={handleLogin}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path
                d="M12.0003 20.45c4.6593 0 7.8053-3.21 7.8053-8.04 0-.69-.07-1.21-.18-1.69h-7.6253v3.2h4.5243c-.27 1.66-1.5793 3.06-3.3293 3.66v2.66h5.0503c-1.39 1.03-3.2 1.63-5.22 1.63-3.87 0-7.07-2.91-7.46-6.66h-5.21v2.7c1.47 3.51 4.96 5.96 8.92 5.96z"
                fill="#34A853"
              />
              <path
                d="M4.5403 13.79c-.21-1.23-.21-2.49 0-3.72l5.21 2.66c.15.54.41 1.03.74 1.47l-5.95 2.61c-1.04-2.88-1.04-6.04-.0003-8.98z"
                fill="#FBBC05"
              />
              <path
                d="M12.0003 4.75c2.37 0 4.24 1.15 5.51 2.36l2.45-2.45c-2.3-2.15-5.43-3.35-7.96-3.35-3.96 0-7.45 2.45-8.92 5.96l5.21 2.7c.39-3.75 3.59-6.66 7.46-6.66z"
                fill="#EA4335"
              />
              <path
                d="M21.9203 14.14c-1.39 3.09-4.82 5.3-8.62 5.3v2.85c5.03 0 9.24-3.13 10.9-7.79l-2.28-1.1z"
                fill="#4285F4"
              />
              <path width="24" height="24" fill="none" d="M0 0h24v24H0z" />
            </svg>
            Google 계정으로 계속하기
          </Button>
          
          {error && (
            <div className="text-sm text-red-500 text-center mt-2">
               {error === "AccessDenied" ? "등록되지 않은 사용자입니다." : "로그인 오류가 발생했습니다."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

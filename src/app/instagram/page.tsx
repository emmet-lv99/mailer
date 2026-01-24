"use client";

import { Button } from "@/components/ui/button";
import { Hammer, Search } from "lucide-react";
import Link from "next/link";

export default function InstagramDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Hammer className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-3">인스타그램 대시보드 준비 중</h1>
      <p className="text-muted-foreground max-w-[500px] mb-8 leading-relaxed">
        현재 대시보드 기능을 열심히 개발하고 있습니다.<br />
        곧 멋진 통계와 인사이트를 한눈에 볼 수 있는 공간으로 찾아뵙겠습니다.
      </p>
      
      <div className="flex gap-4">
        <Link href="/instagram/search">
          <Button size="lg" className="gap-2">
            <Search className="w-4 h-4" />
            인플루언서 검색하러 가기
          </Button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function MallHistoryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-3">몰 기획 이력</h1>
      <p className="text-muted-foreground max-w-[500px] mb-8 leading-relaxed">
        지금까지 기획한 몰 시안 프로젝트들을 모아볼 수 있는 곳입니다.<br />
        아직 진행된 프로젝트가 없거나 기능을 준비 중입니다.
      </p>
      
      <div className="flex gap-4">
        <Link href="/youtube/mall">
          <Button>새로운 몰 기획하러 가기</Button>
        </Link>
      </div>
    </div>
  );
}

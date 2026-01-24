"use client";

import { Button } from "@/components/ui/button";
import { Hammer } from "lucide-react";
import Link from "next/link";

export default function MallPlanningPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Hammer className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-3">유튜브 기반 커머스 몰 기획</h1>
      <p className="text-muted-foreground max-w-[500px] mb-8 leading-relaxed">
        유튜브 채널의 감성을 분석하여 딱 맞는 커머스 몰 디자인을 제안해 드립니다.<br />
        곧 3단계 기획 프로세스(분석-레퍼런스-디자인)가 오픈됩니다! 🏗️
      </p>
      
      <div className="flex gap-4">
        <Link href="/youtube/search">
          <Button variant="outline">채널 더 찾아보기</Button>
        </Link>
      </div>
    </div>
  );
}

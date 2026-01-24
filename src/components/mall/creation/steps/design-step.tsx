"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface DesignStepProps {
  onBack: () => void;
}

export function DesignStep({ onBack }: DesignStepProps) {
  return (
    <div className="flex h-[calc(100vh-200px)] border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Left Sidebar: Navigation & Context */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm text-gray-900">Design Progress</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Phase 1: PC */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Phase 1: PC Web
            </h4>
            
            <div className="space-y-1">
              {/* Main Page (Active) */}
              <div className="flex items-center justify-between p-2 rounded-md bg-blue-50 text-blue-700 border border-blue-100 cursor-pointer">
                <span className="text-sm font-medium">1. Main Page</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px]">Active</Badge>
              </div>
              
              {/* Detail Page */}
              <div className="flex items-center justify-between p-2 rounded-md text-gray-500 hover:bg-gray-100 cursor-pointer">
                <span className="text-sm">2. Detail Page</span>
              </div>
              
              {/* List Page */}
              <div className="flex items-center justify-between p-2 rounded-md text-gray-500 hover:bg-gray-100 cursor-pointer">
                <span className="text-sm">3. List Page</span>
              </div>
            </div>
          </div>

          {/* Phase 2: Mobile */}
          <div className="space-y-2 opacity-50">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              Phase 2: Mobile <Lock className="w-3 h-3" />
            </h4>
            <div className="space-y-1">
              <div className="p-2 text-sm text-gray-400">4. Main Page</div>
              <div className="p-2 text-sm text-gray-400">5. Detail Page</div>
              <div className="p-2 text-sm text-gray-400">6. List Page</div>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Workspace */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        <div className="p-6 border-b bg-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Main Page Generation</h2>
            <p className="text-sm text-muted-foreground">PC 버전 메인페이지 시안을 생성합니다.</p>
          </div>
          <Button>시안 생성하기</Button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {/* Empty State */}
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              🎨
            </div>
            <div>
              <h3 className="text-lg font-medium">아직 생성된 시안이 없습니다.</h3>
              <p className="text-muted-foreground">우측 상단의 '시안 생성하기' 버튼을 눌러주세요.</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-white flex justify-between">
           <Button variant="ghost" onClick={onBack}>이전 단계로</Button>
        </div>
      </div>

      {/* Right Sidebar: Context (Optional) */}
      <div className="w-72 border-l bg-white hidden xl:block">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm text-gray-900">Context</h3>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-500 text-center py-8">
            이전 단계 결과물이<br/>여기에 표시됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}

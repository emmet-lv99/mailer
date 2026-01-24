"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "lucide-react";

interface LayoutSystemCardProps {
  layout: {
    borderRadius: string;
    spacing: string;
    grid: string;
    main: string;
    list: string;
    detail: string;
  };
  onLayoutChange: (field: string, value: string) => void;
}

export function LayoutSystemCard({ layout, onLayoutChange }: LayoutSystemCardProps) {
  const grids = [
    { name: "Cafe24 Standard (Dense)", value: "cafe24-standard" },
    { name: "Editorial (Loose)", value: "editorial" },
    { name: "Mobile First (1-Col)", value: "mobile-first" },
  ];

  const mainLayouts = [
    { name: "Hero Grid (Standard)", value: "hero-grid" },
    { name: "Full Screen Scroll", value: "full-scroll" },
    { name: "Sticky Story", value: "sticky-story" },
    { name: "Minimal Archive", value: "minimal-archive" },
  ];

  const listLayouts = [
    { name: "Grid 3-Column", value: "grid-3" },
    { name: "Grid 2-Column", value: "grid-2" },
    { name: "List View (Wide)", value: "list-wide" },
    { name: "Masonry", value: "masonry" },
  ];

  const detailLayouts = [
    { name: "Split View (Standard)", value: "split-view" },
    { name: "Vertical Stack", value: "vertical-stack" },
    { name: "Magazine Style", value: "magazine" },
  ];

  const radiuses = [
    { name: "Sharp (0px)", value: "0px" },
    { name: "Subtle (4px)", value: "4px" },
    { name: "Standard (8px)", value: "8px" },
    { name: "Round (16px)", value: "16px" },
  ];

  const spacingRules = [
    { name: "Comfortable (Wide)", value: "comfortable" },
    { name: "Compact (Narrow)", value: "compact" },
  ];

  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden h-full flex flex-col">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Layout className="w-5 h-5 text-indigo-500" />
          4. 페이지 레이아웃 세트
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex-1 space-y-8">
        {/* Global Rules */}
        <div className="space-y-4">
          <Label className="text-[10px] text-indigo-500 uppercase font-black tracking-widest">Global Design Rules</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">곡률 (Radius)</Label>
              <Select value={layout.borderRadius} onValueChange={(val) => onLayoutChange("borderRadius", val)}>
                <SelectTrigger className="rounded-xl border-gray-100 h-11 bg-gray-50/50">
                  <SelectValue placeholder="곡률 선택" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {radiuses.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="rounded-lg">
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">간격 (Spacing)</Label>
              <Select value={layout.spacing} onValueChange={(val) => onLayoutChange("spacing", val)}>
                <SelectTrigger className="rounded-xl border-gray-100 h-11 bg-gray-50/50">
                  <SelectValue placeholder="간격 선택" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {spacingRules.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="rounded-lg">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Page Specific Layouts - Refactored to Tabs */}
        <div className="space-y-2">
          <Label className="text-[10px] text-indigo-500 uppercase font-black tracking-widest">Page Specific Patterns</Label>
          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 p-1 rounded-xl h-10">
              <TabsTrigger 
                value="main" 
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                메인
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                리스트
              </TabsTrigger>
              <TabsTrigger 
                value="detail" 
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                상세
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
              <TabsContent value="main" className="mt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <Label className="text-xs font-bold text-gray-700">메인 페이지 구조</Label>
                     <span className="text-[10px] text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">Hero / Event / Display</span>
                  </div>
                  <Select value={layout.main} onValueChange={(val) => onLayoutChange("main", val)}>
                    <SelectTrigger className="rounded-xl border-gray-200 h-11 bg-white">
                      <SelectValue placeholder="메인 레이아웃 선택" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {mainLayouts.map((m) => (
                        <SelectItem key={m.value} value={m.value} className="rounded-lg text-xs">
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground pl-1">
                    쇼핑몰의 첫인상을 결정하는 메인 페이지의 전체적인 구조를 정의합니다.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <Label className="text-xs font-bold text-gray-700">상품 리스트 구조</Label>
                     <span className="text-[10px] text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">Grid / Filter / Pagination</span>
                  </div>
                  <Select value={layout.list} onValueChange={(val) => onLayoutChange("list", val)}>
                    <SelectTrigger className="rounded-xl border-gray-200 h-11 bg-white">
                      <SelectValue placeholder="리스트 선택" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {listLayouts.map((l) => (
                        <SelectItem key={l.value} value={l.value} className="rounded-lg text-xs">
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground pl-1">
                    카테고리 및 상품 목록 화면에서의 상품 진열 방식을 선택합니다.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="detail" className="mt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <Label className="text-xs font-bold text-gray-700">상품 상세 구조</Label>
                     <span className="text-[10px] text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">Gallery / Info / Review</span>
                  </div>
                  <Select value={layout.detail} onValueChange={(val) => onLayoutChange("detail", val)}>
                    <SelectTrigger className="rounded-xl border-gray-200 h-11 bg-white">
                      <SelectValue placeholder="상세 선택" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {detailLayouts.map((d) => (
                        <SelectItem key={d.value} value={d.value} className="rounded-lg text-xs">
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground pl-1">
                    개별 상품의 이미지와 정보를 고객에게 전달하는 레이아웃입니다.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Layout Visualizer Blueprint */}
        <div className="mt-4 flex-1 bg-slate-900 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-4 border border-white/5 shadow-2xl">
           <div className="flex justify-between items-center opacity-40">
              <div className="w-12 h-2 bg-white/20 rounded-full" />
              <div className="flex gap-2">
                {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-white/20 rounded-full" />)}
              </div>
           </div>
           
           <div className="space-y-3">
             <div className="h-24 w-full bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center" style={{ borderRadius: layout.borderRadius }}>
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">{layout.main}</span>
             </div>
             
             <div className="grid grid-cols-3 gap-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center" style={{ borderRadius: layout.borderRadius }}>
                     <span className="text-[8px] text-white/20 font-bold uppercase">{layout.list}</span>
                  </div>
                ))}
             </div>
           </div>

           <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <span className="text-[40px] font-black uppercase tracking-tighter -rotate-12 select-none">Layout Set</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

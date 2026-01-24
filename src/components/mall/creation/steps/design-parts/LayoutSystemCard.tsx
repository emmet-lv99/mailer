"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "lucide-react";

interface LayoutSystemCardProps {
  layout: {
    borderRadius: string;
    spacing: string;
    grid: string;
  };
  onLayoutChange: (field: string, value: string) => void;
}

export function LayoutSystemCard({ layout, onLayoutChange }: LayoutSystemCardProps) {
  const grids = [
    { name: "Cafe24 Standard (Dense)", value: "cafe24-standard" },
    { name: "Editorial (Loose)", value: "editorial" },
    { name: "Mobile First (1-Col)", value: "mobile-first" },
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
          4. 페이지 레이아웃
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex-1 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">그리드 시스템 (Grid)</Label>
            <Select value={layout.grid} onValueChange={(val) => onLayoutChange("grid", val)}>
              <SelectTrigger className="rounded-xl border-gray-100 h-11 bg-gray-50/50">
                <SelectValue placeholder="그리드 선택" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {grids.map((g) => (
                  <SelectItem key={g.value} value={g.value} className="rounded-lg">
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

        {/* Layout Visualizer Blueprint */}
        <div className="mt-4 flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-4 border-dashed relative overflow-hidden flex flex-col gap-2">
           <div className="h-6 w-full bg-slate-200/50 rounded-md" style={{ borderRadius: layout.borderRadius }} />
           <div className="flex gap-2 h-16">
              <div className="flex-[2] bg-indigo-100/50 rounded-md" style={{ borderRadius: layout.borderRadius }} />
              <div className="flex-1 bg-slate-200/30 rounded-md border border-slate-200/50" style={{ borderRadius: layout.borderRadius }} />
           </div>
           <div className="grid grid-cols-4 gap-2 h-10">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-200/20 rounded-sm" style={{ borderRadius: layout.borderRadius }} />
              ))}
           </div>
           <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <span className="text-[40px] font-black uppercase tracking-tighter -rotate-12 select-none">Blueprint</span>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

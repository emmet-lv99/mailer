"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

interface ColorSystemCardProps {
  colors: {
    primary: string;
    secondary: string;
    background: { main: string; sub: string };
    text: { title: string; body: string };
  };
  onColorChange: (path: string[], value: string) => void;
}

export function ColorSystemCard({ colors, onColorChange }: ColorSystemCardProps) {
  const colorSections = [
    { label: "Primary Brand Color", value: colors.primary, path: ["primary"] },
    { label: "Secondary Color", value: colors.secondary, path: ["secondary"] },
    { label: "Main Background", value: colors.background.main, path: ["background", "main"] },
    { label: "Sub Background", value: colors.background.sub, path: ["background", "sub"] },
    { label: "Title Text", value: colors.text.title, path: ["text", "title"] },
    { label: "Body Text", value: colors.text.body, path: ["text", "body"] },
  ];

  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden h-full flex flex-col">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-500" />
          3. 컬러 시스템
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex-1 space-y-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {colorSections.map((section) => (
            <div key={section.label} className="space-y-1.5">
              <Label className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                {section.label}
              </Label>
              <div className="flex gap-2">
                <div className="relative w-10 h-10 rounded-xl border border-gray-100 shadow-inner flex-shrink-0 overflow-hidden group cursor-pointer transition-transform active:scale-95">
                  <div 
                    className="absolute inset-0 z-10" 
                    style={{ backgroundColor: section.value }} 
                  />
                  <input
                    type="color"
                    value={section.value}
                    onChange={(e) => onColorChange(section.path, e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1 relative">
                  <Input 
                    value={section.value} 
                    onChange={(e) => onColorChange(section.path, e.target.value)}
                    className="h-10 rounded-xl border-gray-100 text-[11px] font-mono bg-gray-50/30 uppercase pl-8"
                  />
                  <div 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: section.value }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Color Preview Palette */}
        <div className="mt-6 flex h-8 rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="flex-1" style={{ backgroundColor: colors.primary }} />
          <div className="flex-1" style={{ backgroundColor: colors.secondary }} />
          <div className="flex-1" style={{ backgroundColor: colors.background.sub }} />
          <div className="flex-1" style={{ backgroundColor: colors.text.title }} />
        </div>
      </CardContent>
    </Card>
  );
}

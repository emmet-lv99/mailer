"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DesignConceptCardProps {
  analysisResult: any;
  isEditing: boolean;
  updateDesign: (field: string, value: any) => void;
}

export function DesignConceptCard({
  analysisResult,
  isEditing,
  updateDesign
}: DesignConceptCardProps) {
  if (!analysisResult) return null;

  return (
    <Card className={isEditing ? "ring-2 ring-indigo-500/20" : ""}>
      <CardHeader className="bg-indigo-50/50 flex flex-row items-center justify-between space-y-0 py-3 px-6">
        <CardTitle className="text-indigo-700 text-sm font-bold uppercase tracking-wider">디자인 컨셉 (Design Concept)</CardTitle>
        {isEditing && <span className="text-[10px] text-indigo-500 font-medium">수정 모드</span>}
      </CardHeader>
      <CardContent className="space-y-6 pt-6 bg-white">
        {/* Concept & Mood */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">컨셉 및 분위기 (Concept & Mood)</h4>
          {isEditing ? (
            <>
              <Textarea 
                value={analysisResult.design?.concept?.description || ""} 
                onChange={(e) => updateDesign("concept", { ...analysisResult.design?.concept, description: e.target.value })}
                className="text-sm h-20 mb-3"
              />
            </>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed mb-3">{analysisResult.design?.concept?.description}</p>
          )}

           {/* Brand Keywords (Moved from Input) */}
           <div className="mt-4">
               <Label className="text-[10px] text-gray-500 uppercase">Brand Keywords (콤마로 구분)</Label>
               {isEditing ? (
                 <Input 
                   value={analysisResult.design?.concept?.keywords?.join(", ") || ""} 
                   onChange={(e) => updateDesign("concept", { ...analysisResult.design?.concept, keywords: e.target.value.split(",").map((s: string) => s.trim()) })}
                   className="mt-1"
                   placeholder="AI가 제안한 키워드를 수정하거나 추가하세요."
                 />
               ) : (
                 <div className="flex flex-wrap gap-2 mt-2">
                   {analysisResult.design?.concept?.keywords?.map((keyword: any, i: number) => (
                     <span key={i} className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                       #{keyword}
                     </span>
                   ))}
                 </div>
               )}
           </div>
        </div>

        {/* Color Palette */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">컬러 팔레트 (Color Palette)</h4>
          <div className="grid grid-cols-3 gap-4">
            {analysisResult.design?.foundation?.colors && Object.entries(analysisResult.design.foundation.colors).map(([key, value]) => (
              typeof value === 'string' && (
                <div key={key} className="flex flex-col gap-2 items-center group">
                  {isEditing ? (
                    <div className="relative">
                      <div 
                        className="w-12 h-12 rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition-transform" 
                        style={{ backgroundColor: (analysisResult.design?.foundation?.colors as any)[key] }}
                        onClick={() => document.getElementById(`color-picker-${key}`)?.click()}
                      />
                      <input 
                        id={`color-picker-${key}`}
                        type="color"
                        value={(analysisResult.design?.foundation?.colors as any)[key] || "#000000"} 
                        onChange={(e) => updateDesign("foundation", { 
                          ...analysisResult.design?.foundation, 
                          colors: { ...analysisResult.design?.foundation?.colors, [key]: e.target.value } 
                        })}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-lg border shadow-sm" 
                      style={{ backgroundColor: value }} 
                    />
                  )}
                  
                  <div className="w-full text-center">
                    <span className="text-[9px] uppercase text-gray-400 block mb-1 font-bold">{key}</span>
                    {isEditing ? (
                      <Input 
                        value={(analysisResult.design?.foundation?.colors as any)[key] || ""} 
                        onChange={(e) => updateDesign("foundation", { 
                          ...analysisResult.design?.foundation, 
                          colors: { ...analysisResult.design?.foundation?.colors, [key]: e.target.value } 
                        })}
                        className="h-7 text-[10px] font-mono px-1 w-full text-center"
                      />
                    ) : (
                      <span className="text-[11px] font-mono font-medium text-gray-600">{value}</span>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Components Style - Removed by request */}

        {/* Mood & Imagery */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">무드 및 이미지 (Mood & Imagery)</h4>
          {isEditing ? (
            <Textarea 
              value={analysisResult.design?.mood?.imagery || ""} 
              onChange={(e) => updateDesign("mood", { ...analysisResult.design?.mood, imagery: e.target.value })}
              className="text-xs h-16"
            />
          ) : (
            <p className="text-sm text-gray-700 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50 leading-relaxed">
              {analysisResult.design?.mood?.imagery}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileImage } from "lucide-react";

interface ReferenceAnalysisCardProps {
  referenceAnalysis: any;
  isEditing: boolean;
  updateReference: (field: string, value: any) => void;
}

export function ReferenceAnalysisCard({
  referenceAnalysis,
  isEditing,
  updateReference
}: ReferenceAnalysisCardProps) {
  if (!referenceAnalysis) return null;

  return (
    <Card className={`animate-in slide-in-from-bottom-4 duration-500 border-indigo-100 shadow-sm ${isEditing ? "ring-2 ring-indigo-500/20" : ""}`}>
      <CardHeader className="bg-indigo-50/30 border-b border-indigo-50 flex flex-row items-center justify-between space-y-0 py-3 px-6">
        <CardTitle className="text-indigo-700 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <FileImage className="w-4 h-4" />
          Step 2. 스타일 분석 리포트
        </CardTitle>
        {isEditing && <span className="text-[10px] text-indigo-500 font-medium">EDIT MODE</span>}
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Concept & Keywords */}
          <div className="col-span-2">
            <h4 className="font-semibold mb-2 text-sm">Concept & Keywords</h4>
            {isEditing ? (
              <>
                <Textarea 
                  value={referenceAnalysis.concept?.description || ""} 
                  onChange={(e) => updateReference("concept", { ...referenceAnalysis.concept, description: e.target.value })}
                  className="text-sm h-20 mb-3"
                />
                <Label className="text-[10px] text-gray-400 uppercase">Keywords (콤마로 구분)</Label>
                <Input 
                  value={referenceAnalysis.concept?.keywords?.join(", ") || ""} 
                  onChange={(e) => updateReference("concept", { ...referenceAnalysis.concept, keywords: e.target.value.split(",").map((s: string) => s.trim()) })}
                />
              </>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-3">
                  {referenceAnalysis.concept?.keywords?.map((k: string, i: number) => (
                    <span key={i} className="text-[11px] font-semibold text-white bg-indigo-500 px-3 py-1 rounded-full">{k}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{referenceAnalysis.concept?.description}</p>
              </>
            )}
          </div>

          <div className="space-y-6">
            {/* Color Palette */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Color Palette</h4>
              <div className="flex gap-4 flex-wrap">
                {Object.entries(referenceAnalysis.foundation.colors).map(([key, value]) => (
                  typeof value === 'string' && (
                    <div key={key} className="flex flex-col items-center gap-2">
                      {isEditing ? (
                        <div className="relative">
                          <div 
                            className="w-12 h-12 rounded-lg border shadow-sm cursor-pointer hover:scale-110 transition-transform" 
                            style={{ backgroundColor: (referenceAnalysis.foundation.colors as any)[key] }}
                            onClick={() => document.getElementById(`ref-color-picker-${key}`)?.click()}
                          />
                          <input 
                            id={`ref-color-picker-${key}`}
                            type="color"
                            value={(referenceAnalysis.foundation.colors as any)[key] || "#000000"} 
                            onChange={(e) => updateReference("foundation", { 
                              ...referenceAnalysis.foundation, 
                              colors: { ...referenceAnalysis.foundation.colors, [key]: e.target.value } 
                            })}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border shadow-sm" style={{ backgroundColor: value }} />
                      )}
                      
                      <div className="text-center">
                        <span className="text-[9px] text-gray-500 uppercase block font-bold">{key}</span>
                        {isEditing ? (
                          <Input 
                            value={(referenceAnalysis.foundation.colors as any)[key] || ""} 
                            onChange={(e) => updateReference("foundation", { 
                              ...referenceAnalysis.foundation, 
                              colors: { ...referenceAnalysis.foundation.colors, [key]: e.target.value } 
                            })}
                            className="h-6 text-[10px] font-mono px-1 w-16 text-center"
                          />
                        ) : (
                          <span className="text-[10px] font-mono text-gray-400">{value}</span>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Typography & Shape */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Typography & Shape</h4>
              <div className="bg-slate-50 p-4 rounded-lg border space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">Font</span>
                  {isEditing ? (
                    <Input 
                      value={referenceAnalysis.foundation.typography?.fontFamily || ""} 
                      onChange={(e) => updateReference("foundation", { 
                        ...referenceAnalysis.foundation, 
                        typography: { ...referenceAnalysis.foundation.typography, fontFamily: e.target.value } 
                      })}
                      className="h-7 text-xs w-48"
                    />
                  ) : (
                    <span className="font-medium">{referenceAnalysis.foundation.typography?.fontFamily}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">Radius</span>
                  {isEditing ? (
                    <Input 
                      value={referenceAnalysis.foundation.shapeLayout?.borderRadius || ""} 
                      onChange={(e) => updateReference("foundation", { 
                        ...referenceAnalysis.foundation, 
                        shapeLayout: { ...referenceAnalysis.foundation.shapeLayout, borderRadius: e.target.value } 
                      })}
                      className="h-7 text-xs w-48"
                    />
                  ) : (
                    <span className="font-medium">{referenceAnalysis.foundation.shapeLayout?.borderRadius}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Components Style */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Components Style</h4>
              <div className="space-y-2">
                {["buttons", "cards"].map((key) => (
                  <div key={key} className="bg-gray-50 p-2.5 rounded-lg flex gap-3 items-start border border-dashed">
                    <span className="text-[10px] font-bold uppercase text-gray-400 min-w-[60px] mt-1">{key}</span>
                    {isEditing ? (
                      <Input 
                        value={(referenceAnalysis.components as any)[key] || ""} 
                        onChange={(e) => updateReference("components", { ...referenceAnalysis.components, [key]: e.target.value })}
                        className="h-7 text-xs flex-1"
                      />
                    ) : (
                      <p className="text-xs text-gray-700">{(referenceAnalysis.components as any)[key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mood & Imagery */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Mood & Imagery</h4>
              <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50 space-y-3">
                {isEditing ? (
                  <>
                    <Textarea 
                      value={referenceAnalysis.mood?.imagery || ""} 
                      onChange={(e) => updateReference("mood", { ...referenceAnalysis.mood, imagery: e.target.value })}
                      className="text-xs h-16"
                    />
                    <div className="flex gap-2 items-center">
                      <Label className="text-[10px] text-indigo-400 uppercase font-bold">Graphic</Label>
                      <Input 
                        value={referenceAnalysis.mood?.graphicMotifs || ""} 
                        onChange={(e) => updateReference("mood", { ...referenceAnalysis.mood, graphicMotifs: e.target.value })}
                        className="h-7 text-xs"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-indigo-900 leading-relaxed mb-2">{referenceAnalysis.mood?.imagery}</p>
                    <div className="flex gap-2">
                      <span className="bg-white px-2 py-1 rounded-md border text-[10px] text-indigo-700 font-medium whitespace-nowrap">
                        Graphic: {referenceAnalysis.mood?.graphicMotifs}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

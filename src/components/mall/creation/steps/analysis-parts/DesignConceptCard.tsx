"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { KeywordSelectionDialog } from "./KeywordSelectionDialog";

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
  const [isKeywordDialogOpen, setIsKeywordDialogOpen] = useState(false);

  if (!analysisResult) return null;

  return (
    <Card className={isEditing ? "ring-2 ring-indigo-500/20" : ""}>
      <KeywordSelectionDialog 
        open={isKeywordDialogOpen}
        onOpenChange={setIsKeywordDialogOpen}
        selectedKeywords={analysisResult.design?.concept?.keywords || []}
        onKeywordsChange={(keywords) => updateDesign("concept", { ...analysisResult.design?.concept, keywords })}
      />
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

            {/* Design Keywords (Visual Style) */}
            <div className="mt-4">
                <Label className="text-[10px] text-gray-500 uppercase">디자인 키워드 (Design Keywords)</Label>
                {isEditing ? (
                  <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-xl bg-gray-50/30">
                    {analysisResult.design?.concept?.keywords?.map((keyword: string, i: number) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="py-1.5 pl-3 pr-2 flex items-center gap-1 bg-white border-indigo-100 hover:bg-white animate-in zoom-in-95 duration-200"
                      >
                        <span className="text-indigo-700 font-bold uppercase tracking-tight">{keyword}</span>
                        <button 
                          onClick={() => {
                            const newKeywords = analysisResult.design.concept.keywords.filter((_: any, idx: number) => idx !== i);
                            updateDesign("concept", { ...analysisResult.design.concept, keywords: newKeywords });
                          }}
                          className="p-0.5 rounded-full hover:bg-indigo-100 text-indigo-400 hover:text-indigo-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 rounded-full border-dashed border-indigo-200 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 flex gap-1 px-3"
                      onClick={() => setIsKeywordDialogOpen(true)}
                    >
                      <Plus className="w-3 h-3" /> 추가
                    </Button>
                  </div>
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

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
        <CardTitle className="text-indigo-700 text-sm font-bold uppercase tracking-wider">Design Concept</CardTitle>
        {isEditing && <span className="text-[10px] text-indigo-500 font-medium">EDIT MODE</span>}
      </CardHeader>
      <CardContent className="space-y-6 pt-6 bg-white">
        {/* Concept & Mood */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Concept & Mood</h4>
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
        </div>

        {/* Color Palette */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Color Palette</h4>
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
          <h4 className="font-semibold mb-2 text-sm">Mood & Imagery</h4>
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

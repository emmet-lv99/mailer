"use client";

import { Badge } from "@/components/ui/badge";

interface DesignContextSidebarProps {
  analysisResult: any;
  referenceAnalysis: any;
}

export function DesignContextSidebar({ analysisResult, referenceAnalysis }: DesignContextSidebarProps) {
  return (
    <div className="w-72 border-l bg-white hidden xl:flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-tight">기획 맥락 (Context)</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Marketing Recap */}
        {analysisResult && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Brand Strategy</h4>
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-3">
              <div>
                <span className="text-[9px] text-blue-400 font-bold block uppercase">Persona</span>
                <p className="text-xs font-bold text-blue-700">{analysisResult.marketing?.persona?.name}</p>
                <p className="text-[10px] text-blue-600/70">{analysisResult.marketing?.persona?.oneLiner}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {analysisResult.marketing?.target?.interests?.slice(0, 3).map((interest: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-[9px] bg-white text-blue-600 border-blue-100">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Visual Recap */}
        {(analysisResult || referenceAnalysis) && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Visual System</h4>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-4">
              {/* Colors */}
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1.5">Key Palette</span>
                <div className="flex gap-2">
                  {/* Step 1 Colors */}
                  {analysisResult?.design?.foundation?.colors?.primary && (
                    <div className="w-6 h-6 rounded-full border border-white shadow-sm" style={{ backgroundColor: analysisResult.design.foundation.colors.primary }} title="Main Primary" />
                  )}
                  {/* Step 2 Colors */}
                  {referenceAnalysis?.foundation?.colors?.primary && (
                    <div className="w-6 h-6 rounded-full border border-white shadow-sm" style={{ backgroundColor: referenceAnalysis.foundation.colors.primary }} title="Ref Primary" />
                  )}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase mb-1.5">Mood</span>
                <div className="flex flex-wrap gap-1">
                  {(analysisResult?.design?.concept?.keywords || []).slice(0, 4).map((k: string, i: number) => (
                    <span key={i} className="text-[9px] bg-white px-1.5 py-0.5 rounded border text-slate-500">#{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reference Thumbnail Recap */}
        {referenceAnalysis && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Design Motif</h4>
            <div className="bg-indigo-50/30 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-700 leading-relaxed italic">
              "{referenceAnalysis.mood?.imagery}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

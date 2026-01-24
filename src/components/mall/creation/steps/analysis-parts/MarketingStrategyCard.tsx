"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MarketingStrategyCardProps {
  analysisResult: any;
  isEditing: boolean;
  updateMarketing: (field: string, value: any) => void;
}

export function MarketingStrategyCard({
  analysisResult,
  isEditing,
  updateMarketing
}: MarketingStrategyCardProps) {
  if (!analysisResult) return null;

  return (
    <Card className={isEditing ? "ring-2 ring-blue-500/20" : ""}>
      <CardHeader className="bg-blue-50/50 flex flex-row items-center justify-between space-y-0 py-3 px-6">
        <CardTitle className="text-blue-700 text-sm font-bold uppercase tracking-wider">Marketing Strategy</CardTitle>
        {isEditing && <span className="text-[10px] text-blue-500 font-medium">EDIT MODE</span>}
      </CardHeader>
      <CardContent className="space-y-6 pt-6 bg-white">
        {/* Persona Section */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Persona</h4>
          <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
            {isEditing ? (
              <>
                <Input 
                  value={analysisResult.marketing?.persona?.name || ""} 
                  onChange={(e) => updateMarketing("persona", { ...analysisResult.marketing?.persona, name: e.target.value })}
                  placeholder="페르소나 이름"
                  className="font-bold text-lg"
                />
                <Input 
                  value={analysisResult.marketing?.persona?.oneLiner || ""} 
                  onChange={(e) => updateMarketing("persona", { ...analysisResult.marketing?.persona, oneLiner: e.target.value })}
                  placeholder="한 줄 설명"
                  className="italic"
                />
                <div className="space-y-1">
                  <Label className="text-[10px] text-gray-400">Needs (콤마로 구분)</Label>
                  <Input 
                    value={analysisResult.marketing?.persona?.needs?.join(", ") || ""} 
                    onChange={(e) => updateMarketing("persona", { ...analysisResult.marketing?.persona, needs: e.target.value.split(",").map((s: string) => s.trim()) })}
                    placeholder="구독자 니즈"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="font-medium text-lg">"{analysisResult.marketing?.persona?.name}"</p>
                <p className="text-muted-foreground italic mb-2 text-sm">{analysisResult.marketing?.persona?.oneLiner}</p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.marketing?.persona?.needs?.map((need: any, i: number) => (
                    <span key={i} className="text-[11px] bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">{need}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Target Audience Section */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Target Audience</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {isEditing ? (
              <>
                <div>
                  <Label className="text-[10px]">연령대</Label>
                  <Input 
                    value={analysisResult.marketing?.target?.ageRange || ""} 
                    onChange={(e) => updateMarketing("target", { ...analysisResult.marketing?.target, ageRange: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-[10px]">성별</Label>
                  <Input 
                    value={analysisResult.marketing?.target?.gender || ""} 
                    onChange={(e) => updateMarketing("target", { ...analysisResult.marketing?.target, gender: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <span className="text-sm border px-3 py-1 rounded-full bg-slate-50">{analysisResult.marketing?.target?.ageRange}</span>
                <span className="text-sm border px-3 py-1 rounded-full bg-slate-50">{analysisResult.marketing?.target?.gender}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-gray-400">주요 관심사 {isEditing && "(콤마로 구분)"}</Label>
            {isEditing ? (
              <Input 
                value={analysisResult.marketing?.target?.interests?.join(", ") || ""} 
                onChange={(e) => updateMarketing("target", { ...analysisResult.marketing?.target, interests: e.target.value.split(",").map((s: string) => s.trim()) })}
              />
            ) : (
              <div className="flex gap-2 flex-wrap">
                {analysisResult.marketing?.target?.interests?.map((interest: any, i: number) => (
                  <span key={i} className="text-xs bg-slate-100 px-3 py-1 rounded-full">{interest}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Strategy Section */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Strategy & USP</h4>
          {isEditing ? (
            <Textarea 
              value={analysisResult.marketing?.strategy?.usp || ""} 
              onChange={(e) => updateMarketing("strategy", { ...analysisResult.marketing?.strategy, usp: e.target.value })}
              className="text-sm h-24"
            />
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-dashed">{analysisResult.marketing?.strategy?.usp}</p>
          )}
        </div>

        {/* Brand Identity / Archetype */}
        <div>
           <h4 className="font-semibold mb-2 text-sm">Brand Identity</h4>
           <div className="space-y-3">
             <div className="bg-slate-50 p-3 rounded border">
               <span className="text-xs text-muted-foreground block mb-1">Brand Archetype</span>
               {isEditing ? (
                 <div className="grid grid-cols-2 gap-2">
                    <Input 
                      value={analysisResult.marketing?.strategy?.brandArchetype?.primary || ""} 
                      onChange={(e) => updateMarketing("strategy", { 
                        ...analysisResult.marketing?.strategy, 
                        brandArchetype: { ...analysisResult.marketing?.strategy?.brandArchetype, primary: e.target.value } 
                      })}
                      placeholder="주 원형"
                    />
                    <Input 
                      value={analysisResult.marketing?.strategy?.brandArchetype?.secondary || ""} 
                      onChange={(e) => updateMarketing("strategy", { 
                        ...analysisResult.marketing?.strategy, 
                        brandArchetype: { ...analysisResult.marketing?.strategy?.brandArchetype, secondary: e.target.value } 
                      })}
                      placeholder="부 원형"
                    />
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                   <span className="font-bold text-blue-600">{analysisResult.marketing?.strategy?.brandArchetype?.primary}</span>
                   <span className="text-xs text-gray-400">+ {analysisResult.marketing?.strategy?.brandArchetype?.secondary}</span>
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* Market Structure IA */}
        <div>
           <h4 className="font-semibold mb-2 text-sm">Market Structure (IA)</h4>
           <div className="space-y-3">
             <div>
                <Label className="text-[10px] text-gray-400 uppercase">GNB Suggestions {isEditing && "(콤마로 구분)"}</Label>
                {isEditing ? (
                  <Input 
                    value={analysisResult.marketing?.structure?.gnb?.join(", ") || ""} 
                    onChange={(e) => updateMarketing("structure", { ...analysisResult.marketing?.structure, gnb: e.target.value.split(",").map((s: string) => s.trim()) })}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {analysisResult.marketing?.structure?.gnb?.map((menu: any, i: number) => (
                      <span key={i} className="text-xs border px-2 py-0.5 rounded-md bg-white shadow-sm">{menu}</span>
                    ))}
                  </div>
                )}
             </div>
           </div>
        </div>

        {/* Competitors List */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Competitors</h4>
          <div className="space-y-2">
            {analysisResult.marketing?.strategy?.competitors?.map((comp: any, i: number) => (
              <div key={i} className="text-sm bg-gray-50 p-2 rounded flex justify-between items-center">
                <span className="font-medium">{comp.name}</span>
                <span className="text-xs text-gray-500 truncate max-w-[150px]">{comp.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

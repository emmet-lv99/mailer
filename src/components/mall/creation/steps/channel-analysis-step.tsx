"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { findProjectsByUrl } from "@/services/mall/project";
import { useMallStore } from "@/services/mall/store";
import { useState } from "react";
import { toast } from "sonner";

interface ChannelAnalysisStepProps {
  onNext: () => void;
}

export function ChannelAnalysisStep({ onNext }: ChannelAnalysisStepProps) {
  const { 
    channelUrl, 
    competitors, 
    analysisResult, 
    setChannelData, 
    setAnalysisResult,
    loadProject,
  } = useMallStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [localUrl, setLocalUrl] = useState(channelUrl);
  const [competitorInput, setCompetitorInput] = useState("");
  const [existingProjects, setExistingProjects] = useState<any[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const startAnalysis = async () => {
    setIsLoading(true);
    try {
      setChannelData(localUrl, competitors);
      
      const response = await fetch("/api/youtube/mall/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl: localUrl, competitorUrls: competitors }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setAnalysisResult(data);
      toast.success("채널 분석이 완료되었습니다!");
    } catch (error) {
      toast.error("분석 중 오류가 발생했습니다. URL을 확인해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!localUrl) return;

    // Check if projects with this URL already exist
    try {
      const projects = await findProjectsByUrl(localUrl);
      if (projects && projects.length > 0) {
        setExistingProjects(projects);
        setShowConfirmDialog(true);
        return;
      }
    } catch (e) {
      console.warn("Failed to check existing projects:", e);
    }

    // No existing projects, proceed normally
    await startAnalysis();
  };

  const loadExisting = (project: any) => {
    loadProject(project);
    setShowConfirmDialog(false);
    toast.success("이전 분석 결과를 성공적으로 가져왔습니다.");
  };

  const addCompetitor = () => {
    if (competitorInput && competitors.length < 3) {
      setChannelData(localUrl, [...competitors, competitorInput]);
      setCompetitorInput("");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Caching Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="text-blue-500">기존 분석 기록이 있습니다</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              이 채널({localUrl})로 분석된 기록이 총 <strong>{existingProjects.length}건</strong> 발견되었습니다.<br /><br />
              이전 결과를 불러와서 시간을 절약하시겠습니까, 아니면 완전히 새롭게 분석하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => {
              setShowConfirmDialog(false);
              startAnalysis(); // Perform new analysis
            }}>새로 분석하기</AlertDialogCancel>
            <AlertDialogAction onClick={() => loadExisting(existingProjects[0])}>
              이전 결과 불러오기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">유튜브 채널 분석</h2>
        <p className="text-muted-foreground">
          운영 중인 유튜브 채널 URL을 입력하면, AI가 브랜드 컨셉을 분석해드립니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>채널 정보 입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="channelUrl">유튜브 채널 URL</Label>
              <Input
                id="channelUrl"
                placeholder="https://www.youtube.com/@channel"
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>경쟁 채널 (Optional)</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="URL 입력" 
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                />
                <Button variant="outline" onClick={addCompetitor} disabled={competitors.length >= 3}>추가</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {competitors.map((url, i) => (
                  <div key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">
                    {url}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleAnalyze} 
            disabled={!localUrl || isLoading}
          >
            {isLoading ? "AI 분석 중... (약 10초)" : "분석 시작하기"}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Result Report */}
      {analysisResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">{analysisResult.channelName} 분석 결과</h2>
              <p className="text-muted-foreground">AI가 도출한 맞춤형 쇼핑몰 전략입니다.</p>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <Button 
              onClick={async () => {
                await useMallStore.getState().save();
                onNext();
              }} 
              size="lg"
            >
              저장하고 다음 단계로 (레퍼런스)
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Marketing Column */}
            <Card>
              <CardHeader className="bg-blue-50/50">
                <CardTitle className="text-blue-700">Marketing Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h4 className="font-semibold mb-2">Persona</h4>
                  <div className="bg-slate-50 p-4 rounded-lg border">
                    <p className="font-medium text-lg">"{analysisResult.marketing?.persona?.name}"</p>
                    <p className="text-muted-foreground italic mb-2">{analysisResult.marketing?.persona?.oneLiner}</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.marketing?.persona?.needs?.map((need: any, i: number) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{need}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Target Audience</h4>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-sm border px-3 py-1 rounded-full">{analysisResult.marketing?.target?.ageRange}</span>
                    <span className="text-sm border px-3 py-1 rounded-full">{analysisResult.marketing?.target?.gender}</span>
                    {analysisResult.marketing?.target?.interests?.map((interest: any, i: number) => (
                      <span key={i} className="text-sm bg-slate-100 px-3 py-1 rounded-full">{interest}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Strategy & SWOT</h4>
                  <p className="text-sm text-gray-700 mb-4">{analysisResult.marketing?.strategy?.usp}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                    <div className="bg-green-50 p-3 rounded">
                      <strong className="text-green-700 block mb-1">Strengths</strong>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.marketing?.strategy?.swot?.strengths?.slice(0,3).map((s: any, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <strong className="text-red-700 block mb-1">Weaknesses</strong>
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.marketing?.strategy?.swot?.weaknesses?.slice(0,3).map((s: any, i: number) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Brand Identity */}
                <div>
                   <h4 className="font-semibold mb-2">Brand Identity</h4>
                   <div className="space-y-3">
                     <div className="bg-slate-50 p-3 rounded border">
                       <span className="text-xs text-muted-foreground block">Brand Archetype</span>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="font-bold text-blue-600">{analysisResult.marketing?.strategy?.brandArchetype?.primary}</span>
                         <span className="text-xs text-gray-400">+ {analysisResult.marketing?.strategy?.brandArchetype?.secondary}</span>
                       </div>
                       <p className="text-xs text-gray-500 mt-1">{analysisResult.marketing?.strategy?.brandArchetype?.mixReason}</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded border">
                       <span className="text-xs text-muted-foreground block">StoryBrand (Hero's Journey)</span>
                       <p className="text-sm mt-1 mb-2"><strong>Guide:</strong> {analysisResult.marketing?.strategy?.storyBrand?.guide}</p>
                       <p className="text-xs text-gray-600">"{analysisResult.marketing?.strategy?.storyBrand?.plan}"</p>
                     </div>
                   </div>
                </div>

                {/* Market Structure (IA) */}
                <div>
                   <h4 className="font-semibold mb-2">Market Structure (IA)</h4>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                          <span className="text-xs font-bold text-gray-500 block mb-1">GNB Suggestions</span>
                          <div className="flex flex-wrap gap-1">
                            {analysisResult.marketing?.structure?.gnb?.map((menu: any, i: number) => (
                              <span key={i} className="text-xs border px-1.5 py-0.5 rounded bg-white">{menu}</span>
                            ))}
                          </div>
                     </div>
                     <div>
                          <span className="text-xs font-bold text-gray-500 block mb-1">Layout Flow</span>
                          <ol className="list-decimal list-inside text-xs text-gray-600 space-y-0.5">
                            {analysisResult.marketing?.structure?.mainLayout?.slice(0,4).map((section: any, i: number) => (
                              <li key={i}>{section}</li>
                            ))}
                          </ol>
                     </div>
                   </div>
                </div>

                {/* Competitors */}
                <div>
                  <h4 className="font-semibold mb-2">Competitors</h4>
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

            {/* Design Column */}
            <Card>
              <CardHeader className="bg-indigo-50/50">
                <CardTitle className="text-indigo-700">Design Concept</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h4 className="font-semibold mb-2">Concept & Mood</h4>
                  <p className="text-gray-700 mb-3">{analysisResult.design?.concept?.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.design?.concept?.keywords?.map((keyword: any, i: number) => (
                      <span key={i} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Color Palette</h4>
                  <div className="flex gap-4">
                    {analysisResult.design?.foundation?.colors && Object.entries(analysisResult.design.foundation.colors).map(([key, value]) => (
                      typeof value === 'string' && (
                        <div key={key} className="flex flex-col items-center gap-1">
                          <div 
                            className="w-12 h-12 rounded-full border shadow-sm ring-2 ring-offset-2 ring-transparent hover:ring-gray-200 transition-all" 
                            style={{ backgroundColor: value }} 
                          />
                          <span className="text-[10px] uppercase text-gray-500">{key}</span>
                          <span className="text-[10px] font-mono text-gray-400">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Typography & Shape</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded border space-y-2">
                       <div>
                          <span className="text-xs text-muted-foreground block">Font Family</span>
                          <span className="font-medium">{analysisResult.design?.foundation?.typography?.fontFamily}</span>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-xs text-muted-foreground block">Scale</span>
                            <span className="text-xs">{analysisResult.design?.foundation?.typography?.scale}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">Weight</span>
                            <span className="text-xs">{analysisResult.design?.foundation?.typography?.weightRule}</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border space-y-2">
                       <div>
                          <span className="text-xs text-muted-foreground block">Border Radius</span>
                          <span className="font-medium">{analysisResult.design?.foundation?.shapeLayout?.borderRadius}</span>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-xs text-muted-foreground block">Spacing</span>
                            <span className="text-xs">{analysisResult.design?.foundation?.shapeLayout?.spacing}</span>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block">Grid</span>
                            <span className="text-xs">{analysisResult.design?.foundation?.shapeLayout?.grid}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Components & Mood Details */}
                <div>
                  <h4 className="font-semibold mb-2">Components Style</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                    <div className="bg-gray-50 p-2 rounded flex gap-2 items-start">
                      <span className="min-w-[70px] text-xs font-bold text-gray-500 uppercase">Button</span>
                      <p className="text-xs">{analysisResult.design?.components?.buttons}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex gap-2 items-start">
                      <span className="min-w-[70px] text-xs font-bold text-gray-500 uppercase">Card</span>
                      <p className="text-xs">{analysisResult.design?.components?.cards}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex gap-2 items-start">
                      <span className="min-w-[70px] text-xs font-bold text-gray-500 uppercase">Input</span>
                      <p className="text-xs">{analysisResult.design?.components?.inputForm}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded flex gap-2 items-start">
                      <span className="min-w-[70px] text-xs font-bold text-gray-500 uppercase">GNB/Footer</span>
                      <p className="text-xs">{analysisResult.design?.components?.gnbFooter}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Mood & Imagery</h4>
                  <p className="text-sm text-gray-700 bg-indigo-50 p-3 rounded border border-indigo-100 mb-2">
                    {analysisResult.design?.mood?.imagery}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                     <span className="text-xs border px-2 py-1 rounded">Graphic: {analysisResult.design?.mood?.graphicMotifs}</span>
                     <span className="text-xs border px-2 py-1 rounded">Icon: {analysisResult.design?.mood?.iconography}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMallStore } from "@/services/mall/store";
import { ArrowLeft, ArrowRight, Code, Pencil, RefreshCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GenerativeRenderer } from "../../render/GenerativeRenderer";

interface LayoutDesignStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function LayoutDesignStep({ onNext, onBack }: LayoutDesignStepProps) {
  const { analysisResult, visualNarrative, setVisualNarrative, generatedHtml, setGeneratedHtml } = useMallStore();
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'narrative' | 'code'>('narrative');

  if (!analysisResult) return null;

  const handleGenerateNarrative = async () => {
    setIsGeneratingNarrative(true);
    const loadingToast = toast.loading("AI가 브랜드 전략을 시각적 기획안으로 변환 중입니다...");

    try {
      const response = await fetch("/api/youtube/mall/design/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mode: 'narrative',
          marketing: analysisResult.marketing,
          design: analysisResult.design
        }),
      });

      const data = await response.json();
      if (data.narrative) {
        setVisualNarrative(data.narrative);
        toast.success("기획안 생성 완료!", { description: "AI가 제안한 디자인 설명을 확인하고 수정해보세요." });
        setActiveTab('narrative');
      }
    } catch (error) {
      console.error(error);
      toast.error("기획안 생성 실패");
    } finally {
      setIsGeneratingNarrative(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleGenerateCode = async () => {
    if (!visualNarrative) {
        toast.error("먼저 기획안(Visual Narrative)을 생성해주세요.");
        return;
    }

    setIsGeneratingCode(true);
    setActiveTab('code');
    const loadingToast = toast.loading("기획안을 바탕으로 실제 HTML 코드를 구축 중입니다...");

    try {
      const response = await fetch("/api/youtube/mall/design/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mode: 'code',
          marketing: analysisResult.marketing,
          design: analysisResult.design,
          narrative: visualNarrative
        }),
      });

      const data = await response.json();
      if (data.html) {
        setGeneratedHtml(data.html);
        toast.success("사이트 구축 완료!", { description: "구축된 화면을 확인하세요." });
      }
    } catch (error) {
      console.error(error);
      toast.error("구축 실패");
    } finally {
      setIsGeneratingCode(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto h-full flex flex-col">
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">Step 3: AI Layout Generation</h2>
            <p className="text-gray-500">
                AI가 작성한 디자인 기획안(Prompt)을 확인하고, 실제 코드로 구현합니다.
            </p>
        </div>

        <div className="flex gap-2 border-b">
            <button 
                onClick={() => setActiveTab('narrative')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'narrative' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                <span className="flex items-center gap-2"><Pencil className="w-4 h-4"/> 1. 기획안(Prompt) 작성</span>
            </button>
            <button 
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'code' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
                <span className="flex items-center gap-2"><Code className="w-4 h-4"/> 2. 사이트 구축(Code)</span>
            </button>
        </div>

        <div className="flex-1 min-h-[500px] flex flex-col">
            {/* TAB 1: Narrative */}
            {activeTab === 'narrative' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex justify-between items-center">
                        <div className="text-sm text-indigo-800">
                            <strong>AI Art Director Mode:</strong> 현재 설정된 브랜드 에셋을 바탕으로 상세한 디자인 지시문을 작성합니다.
                        </div>
                        <Button 
                            onClick={handleGenerateNarrative} 
                            disabled={isGeneratingNarrative}
                            variant="outline"
                            className="bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                        >
                            {isGeneratingNarrative ? <RefreshCcw className="w-4 h-4 animate-spin mr-2"/> : <Sparkles className="w-4 h-4 mr-2"/>}
                            {visualNarrative ? "기획안 다시 작성" : "기획안 생성하기"}
                        </Button>
                    </div>
                    
                    <div className="relative">
                        <Textarea 
                            value={visualNarrative || ""} 
                            onChange={(e) => setVisualNarrative(e.target.value)}
                            placeholder="위 버튼을 눌러 AI 기획안을 생성하세요. 생성된 텍스트를 자유롭게 수정하여 디자인 방향을 바꿀 수 있습니다."
                            className="min-h-[400px] font-mono text-sm leading-relaxed p-6 resize-none shadow-sm focus:ring-indigo-500"
                        />
                        {!visualNarrative && !isGeneratingNarrative && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                <span className="text-6xl font-bold text-gray-300">WAITING FOR PROMPT</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end">
                         <Button onClick={() => setActiveTab('code')} disabled={!visualNarrative} className="gap-2">
                             다음: 코드 생성하기 <ArrowRight className="w-4 h-4"/>
                         </Button>
                    </div>
                </div>
            )}

            {/* TAB 2: Code */}
            {activeTab === 'code' && (
                <div className="space-y-4 h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex justify-between items-center shrink-0">
                        <div className="text-sm text-slate-800">
                            <strong>AI Developer Mode:</strong> 확정된 기획안을 바탕으로 HTML/CSS를 코딩합니다.
                        </div>
                        <Button 
                            onClick={handleGenerateCode} 
                            disabled={isGeneratingCode}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                        >
                            {isGeneratingCode ? <RefreshCcw className="w-4 h-4 animate-spin mr-2"/> : <Code className="w-4 h-4 mr-2"/>}
                            사이트 구축 시작
                        </Button>
                    </div>

                    <div className="flex-1 border rounded-xl overflow-hidden shadow-xl bg-white relative">
                        {generatedHtml ? (
                            <GenerativeRenderer htmlCode={generatedHtml} />
                        ) : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-4">
                                <Code className="w-16 h-16 opacity-20" />
                                <span className="text-lg font-medium">아직 생성된 코드가 없습니다.</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="flex justify-between pt-4 border-t mt-auto shrink-0">
            <Button variant="ghost" onClick={onBack} className="gap-2 pl-0 hover:pl-2 transition-all">
                <ArrowLeft className="w-4 h-4" /> 이전 단계
            </Button>
            <Button onClick={onNext} disabled={!generatedHtml} className="gap-2 bg-indigo-600 hover:bg-indigo-700 hover:pr-6 transition-all">
                다음 단계 <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
    </div>
  );
}

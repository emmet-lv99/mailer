import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AnalysisProgressProps {
    stage: 'idle' | 'scraping' | 'analyzing' | 'evaluating' | 'generating' | 'complete';
}

export function AnalysisProgress({ stage }: AnalysisProgressProps) {
    const [progress, setProgress] = useState(0);

    // Initial Progress Mapping based on Stage
    useEffect(() => {
        let target = 0;
        switch (stage) {
            case 'scraping': target = 15; break;
            case 'analyzing': target = 45; break;
            case 'evaluating': target = 70; break;
            case 'generating': target = 90; break;
            case 'complete': target = 100; break;
            default: target = 0;
        }
        
        // Smooth transition
        const timer = setTimeout(() => {
            setProgress(target);
        }, 100);
        return () => clearTimeout(timer);
    }, [stage]);

    // Live Simulate Progress within stage (to make it feel alive)
    useEffect(() => {
        if (stage === 'complete') return;
        
        const interval = setInterval(() => {
            setProgress(prev => {
                // Cap progress based on current stage to wait for next trigger
                let max = 0;
                switch (stage) {
                    case 'scraping': max = 35; break;   // Scrape can take time, inch up to 35%
                    case 'analyzing': max = 65; break;  // Inch up to 65%
                    case 'evaluating': max = 85; break; // Inch up to 85%
                    case 'generating': max = 98; break; // Inch up to 98%
                    default: max = 0;
                }
                
                if (prev < max) {
                    return prev + 1;
                }
                return prev;
            });
        }, 300); // Update every 300ms

        return () => clearInterval(interval);
    }, [stage]);

    const steps = [
        { id: 'scraping', label: "데이터 수집", sub: "Instagram 게시물 크롤링 (30개)" },
        { id: 'analyzing', label: "지표 분석", sub: "ER, 이탈률, 봇 탐지 계산" },
        { id: 'evaluating', label: "AI 심사", sub: "Gemini Pro Vision 평가" },
        { id: 'generating', label: "리포트 생성", sub: "최종 결과 포맷팅" },
    ];

    const getCurrentStepIndex = () => {
        if (stage === 'complete') return 4;
        const map = { 'idle': -1, 'scraping': 0, 'analyzing': 1, 'evaluating': 2, 'generating': 3 };
        return map[stage];
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        AI 분석 수행 중...
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">약 15-30초 소요됩니다.</p>
                </div>
                <span className="text-xl font-black text-blue-600 font-mono">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Steps List */}
            <div className="space-y-3">
                {steps.map((step, idx) => {
                    const isActive = idx === currentStepIndex;
                    const isCompleted = idx < currentStepIndex;
                    const isPending = idx > currentStepIndex;

                    return (
                        <div key={step.id} className={`flex items-start gap-3 transition-colors duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                            {/* Icon */}
                            <div className="mt-0.5 shrink-0">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : isActive ? (
                                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                ) : (
                                    <Circle className="w-4 h-4 text-slate-300" />
                                )}
                            </div>
                            
                            {/* Text */}
                            <div className="flex-1">
                                <p className={`text-xs font-semibold ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {isCompleted ? `${step.label} 완료` : step.label}
                                </p>
                                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                                    {step.sub}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

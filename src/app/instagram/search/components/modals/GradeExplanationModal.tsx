import { GRADING_CRITERIA } from "@/services/instagram/utils";
import { X } from "lucide-react";

interface GradeExplanationModalProps {
    onClose: () => void;
    tier: string;
    er: number;
    authDetails: any;
}

export function GradeExplanationModal({ onClose, tier, er, authDetails }: GradeExplanationModalProps) {
    const criteria = GRADING_CRITERIA[tier];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-[400px] bg-white/95 p-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center text-center border-2 border-indigo-100 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            <h4 className="text-base font-bold text-indigo-900 mb-3">등급 산정 기준 ({tier})</h4>
            <div className="text-sm text-gray-800 space-y-4 w-full px-2">
                <div>
                    <p className="font-semibold mb-1">내 ER: <span className="font-mono font-bold text-indigo-700 text-lg">{er.toFixed(2)}%</span></p>
                    
                    {/* ER Visual Gauge */}
                    {criteria && (() => {
                        const maxVal = Math.max(er, criteria.S * 1.3);
                        const getPos = (val: number) => Math.min(100, (val / maxVal) * 100);
                        
                        return (
                            <div className="relative h-6 mt-4 mb-5 mx-1 select-none">
                                {/* Background Bar */}
                                <div className="absolute top-2 inset-x-0 h-2 bg-gradient-to-r from-gray-200 via-indigo-200 to-indigo-400 rounded-full opacity-30"></div>
                                
                                {/* Threshold Markers */}
                                {[ 
                                    { val: criteria.C, label: 'C' }, 
                                    { val: criteria.B, label: 'B' }, 
                                    { val: criteria.A, label: 'A' }, 
                                    { val: criteria.S, label: 'S' } 
                                ].map((t) => (
                                    <div key={t.label} className="absolute top-2 w-px h-2 bg-gray-400" style={{ left: `${getPos(t.val)}%` }}>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 font-bold">{t.label}</div>
                                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] text-gray-400">{t.val}%</div>
                                    </div>
                                ))}

                                {/* User Value Marker */}
                                <div className="absolute top-0 w-1 h-6 bg-indigo-600 rounded-full shadow-md z-10 transition-all duration-500" style={{ left: `${getPos(er)}%` }}>
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-indigo-700 whitespace-nowrap">나 ({er.toFixed(1)}%)</div>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <div className="text-xs text-gray-600 border-t border-gray-200 pt-3 w-full space-y-1 font-medium bg-gray-50 rounded p-2 text-left">
                    <div className="flex justify-between">
                        <span>피드 ER (60%):</span>
                        <span className="font-bold">{(authDetails?.er?.feedER || 0).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>릴스 ER (40%):</span>
                        <span className="font-bold">{(authDetails?.er?.reelsER || 0).toFixed(2)}%</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

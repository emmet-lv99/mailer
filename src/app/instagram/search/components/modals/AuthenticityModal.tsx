import { X } from "lucide-react";

interface AuthenticityModalProps {
    onClose: () => void;
    authenticityScore: number;
    authDetails: any;
}

export function AuthenticityModal({ onClose, authenticityScore, authDetails }: AuthenticityModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-[400px] bg-white/95 p-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center text-center border-2 border-green-100 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            <h4 className="text-base font-bold text-green-900 mb-2">신뢰도 점수 분석</h4>
            
            <div className="space-y-4 w-full px-1 overflow-y-auto max-h-[80%] hide-scrollbar">
                {/* 1. Comment Ratio Visual */}
                <div className="text-left">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-700">댓글 비율 ({authDetails?.commentRatio?.toFixed(2)}%)</span>
                        <span className="font-bold text-green-700">+{authDetails?.commentScore}점 ✅</span>
                    </div>
                    {(() => {
                        const val = authDetails.commentRatio;
                        const markers = [{ v: 1.0, l: '적정' }, { v: 3.0, l: '우수' }, { v: 5.0, l: '최우수' }];
                        const maxVal = Math.max(val, 7.5);
                        const getPos = (v: number) => Math.min(100, (v / maxVal) * 100);

                        return (
                            <div className="relative h-4 mx-1 select-none">
                                <div className="absolute top-1.5 inset-x-0 h-1.5 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-full"></div>
                                {markers.map((m) => (
                                    <div key={m.l} className="absolute top-1.5 w-px h-1.5 bg-gray-300" style={{ left: `${getPos(m.v)}%` }}>
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[6px] text-gray-400 whitespace-nowrap">{m.l}({m.v}%)</div>
                                    </div>
                                ))}
                                <div className="absolute top-0.5 w-1 h-3.5 bg-black rounded-full shadow z-10" style={{ left: `${getPos(val)}%` }}></div>
                            </div>
                        );
                    })()}
                </div>

                {/* 2. View Ratio Visual */}
                <div className="text-left">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-700">조회수 비율 {authDetails?.viewScore !== null ? `(${authDetails.viewRatio.toFixed(3)})` : ''}</span>
                        {authDetails?.viewScore !== null ? (
                            <span className="font-bold text-green-700">+{authDetails.viewScore}점 ✅</span>
                        ) : (
                            <span className="text-gray-400 font-medium">측정 불가 ⚪</span>
                        )}
                    </div>
                    {authDetails?.viewScore !== null && (() => {
                        const val = authDetails.viewRatio;
                        const markers = [{ v: 0.01, l: '적정' }, { v: 0.02, l: '우수' }, { v: 0.03, l: '최우수' }];
                        const maxVal = Math.max(val, 0.045);
                        const getPos = (v: number) => Math.min(100, (v / maxVal) * 100);

                        return (
                            <div className="relative h-4 mx-1 select-none">
                                <div className="absolute top-1.5 inset-x-0 h-1.5 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-full"></div>
                                {markers.map((m) => (
                                    <div key={m.l} className="absolute top-1.5 w-px h-1.5 bg-gray-300" style={{ left: `${getPos(m.v)}%` }}>
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[6px] text-gray-400 whitespace-nowrap">{m.l}</div>
                                    </div>
                                ))}
                                <div className="absolute top-0.5 w-1 h-3.5 bg-black rounded-full shadow z-10" style={{ left: `${getPos(val)}%` }}></div>
                            </div>
                        );
                    })()}
                </div>

                {/* 3. Consistency */}
                <div className="flex justify-between text-xs border-b border-gray-100 pb-2">
                    <span className="text-gray-700 font-semibold">참여도 균형</span>
                    {authDetails?.consistencyScore !== null ? (
                        <span className="font-bold text-green-700">+{authDetails.consistencyScore}점 {authDetails.consistencyScore >= 20 ? '✅' : '⚠️'}</span>
                    ) : (
                        <span className="text-gray-400 font-medium">측정 불가 ⚪</span>
                    )}
                </div>
                
                <div className="mt-2 text-sm font-bold text-green-900 border-t border-gray-200 pt-2 flex justify-between bg-green-50 rounded px-2 py-1">
                    <span>최종 신뢰 점수</span>
                    <span>{authenticityScore} / 100</span>
                </div>

                {/* Footer Notes */}
                <div className="mt-2 text-[10px] text-left text-gray-500 space-y-0.5 px-1 py-2 border-t border-gray-100">
                    <p>* {authDetails?.viewScore !== null ? '완전 분석 (피드+릴스)' : '피드만 분석 (릴스 없음)'}</p>
                    {authDetails?.consistencyScore !== null && authDetails.consistencyScore < 20 && (
                        <p className="text-amber-600 font-medium">* 참여도 균형 주의: 피드/릴스 차이 {Math.round((authDetails.consistencyRatio || 0) * 100)}%</p>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}

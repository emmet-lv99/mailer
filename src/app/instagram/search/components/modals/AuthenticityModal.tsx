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
                    <div className="flex justify-between text-xs mb-1 items-center">
                        <span className="font-semibold text-gray-700 flex items-center gap-1">
                            ✅ 댓글 비율
                        </span>
                        <span className="font-bold text-green-700">
                            {Math.round((authDetails?.commentScore / 20) * 100)}% (+{authDetails?.commentScore}/20점)
                        </span>
                    </div>
                    {/* Visual Bar */}
                    {(() => {
                        const val = authDetails.commentRatio;
                        const markers = [{ v: 1.0, l: '적정' }, { v: 3.0, l: '우수' }, { v: 5.0, l: '최우수' }];
                        const maxVal = Math.max(val, 7.5);
                        const getPos = (v: number) => Math.min(100, (v / maxVal) * 100);

                        return (
                            <div className="relative h-4 mb-2 select-none group/bar">
                                <div className="absolute top-1.5 inset-x-0 h-1.5 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-full"></div>
                                {markers.map((m) => (
                                    <div key={m.l} className="absolute top-1.5 w-px h-1.5 bg-gray-300" style={{ left: `${getPos(m.v)}%` }}>
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[6px] text-gray-400 whitespace-nowrap">{m.l}</div>
                                    </div>
                                ))}
                                <div className="absolute top-0.5 w-1 h-3.5 bg-black rounded-full shadow z-10" style={{ left: `${getPos(val)}%` }}>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black text-white text-[8px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                        실측값: {val.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* 2. View Ratio Visual */}
                <div className="text-left">
                    <div className="flex justify-between text-xs mb-1 items-center">
                        <span className={`font-semibold flex items-center gap-1 ${authDetails?.viewScore !== null ? 'text-gray-700' : 'text-gray-400'}`}>
                            {authDetails?.viewScore !== null ? '✅' : '⚪'} 조회수 비율
                        </span>
                        {authDetails?.viewScore !== null ? (
                            <span className="font-bold text-green-700">
                                {Math.round((authDetails.viewScore / 20) * 100)}% (+{authDetails.viewScore}/20점)
                            </span>
                        ) : (
                            <span className="text-gray-400 font-medium flex items-center gap-1 group relative cursor-help">
                                - (측정 불가)
                                <span className="text-[10px] bg-gray-100 rounded-full w-3.5 h-3.5 flex items-center justify-center font-serif">i</span>
                                <span className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-800 text-white text-[9px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed font-normal">
                                    릴스 게시물이 없어 조회수 비율을 측정할 수 없습니다. 이는 페널티가 아니며, 댓글 비율만으로 신뢰도를 평가합니다.
                                </span>
                            </span>
                        )}
                    </div>
                    {authDetails?.viewScore !== null && (() => {
                        const val = authDetails.viewRatio;
                        const markers = [{ v: 0.01, l: '적정' }, { v: 0.02, l: '우수' }, { v: 0.03, l: '최우수' }];
                        const maxVal = Math.max(val, 0.045);
                        const getPos = (v: number) => Math.min(100, (v / maxVal) * 100);

                        return (
                            <div className="relative h-4 select-none group/bar">
                                <div className="absolute top-1.5 inset-x-0 h-1.5 bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 rounded-full"></div>
                                {markers.map((m) => (
                                    <div key={m.l} className="absolute top-1.5 w-px h-1.5 bg-gray-300" style={{ left: `${getPos(m.v)}%` }}>
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[6px] text-gray-400 whitespace-nowrap">{m.l}</div>
                                    </div>
                                ))}
                                <div className="absolute top-0.5 w-1 h-3.5 bg-black rounded-full shadow z-10" style={{ left: `${getPos(val)}%` }}>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-black text-white text-[8px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                                        실측값: {val.toFixed(3)}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* 3. Consistency */}
                <div className="flex justify-between text-xs border-b border-gray-100 pb-2 items-center">
                    <span className={`font-semibold flex items-center gap-1 ${authDetails?.consistencyScore !== null ? 'text-gray-700' : 'text-gray-400'}`}>
                        {authDetails?.consistencyScore !== null ? (authDetails.consistencyScore >= 20 ? '✅' : '⚠️') : '⚪'} 참여도 균형
                    </span>
                    {authDetails?.consistencyScore !== null ? (
                        <span className="font-bold text-green-700">
                            {Math.round((authDetails.consistencyScore / 20) * 100)}% (+{authDetails.consistencyScore}/20점)
                        </span>
                    ) : (
                        <span className="text-gray-400 font-medium">- (측정 불가)</span>
                    )}
                </div>
                
                <div className="mt-2 text-sm font-bold text-green-900 border-t border-gray-200 pt-2 flex justify-between bg-green-50 rounded px-2 py-1">
                    <div className="flex flex-col items-start text-left">
                        <span>최종 신뢰 점수</span>
                        <span className="text-[9px] font-normal text-green-700/70">📊 분석 항목: {authDetails?.viewScore !== null ? '3/3' : '1/3'}</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span>{authenticityScore}/100</span>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-2 text-[10px] text-left text-gray-500 space-y-0.5 px-1 py-2 border-t border-gray-100">
                    <p>* {authDetails?.viewScore !== null ? '완전 분석 (피드+릴스)' : '피드만 분석 (릴스 없음, 페널티 없음)'}</p>
                    {authDetails?.consistencyScore !== null && authDetails.consistencyScore < 20 && (
                        <p className="text-amber-600 font-medium">* 참여도 균형 주의: 피드/릴스 차이 {Math.round((authDetails.consistencyRatio || 0) * 100)}%</p>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}

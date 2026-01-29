import { X } from "lucide-react";

interface FakeAccountModalProps {
    onClose: () => void;
    authDetails: any;
    tier: string;
}

export function FakeAccountModal({ onClose, authDetails, tier }: FakeAccountModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-[400px] bg-white/95 p-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center text-center border-2 border-orange-100 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            <h4 className="text-base font-bold text-orange-900 mb-3">가짜 계정 의심</h4>
            <div className="space-y-3 w-full px-2">
                <div className="p-3 bg-orange-50 rounded-lg">
                    <h5 className="text-xs font-bold text-orange-800 mb-1">댓글 비율 부족</h5>
                    <p className="text-sm text-orange-700">
                        현재: <span className="font-mono font-bold">
                            {(authDetails?.commentRatioVal !== undefined 
                                ? authDetails.commentRatioVal * 100 
                                : (authDetails?.commentRatio || 0)).toFixed(2)}%
                        </span>
                    </p>
                    <p className="text-[10px] text-orange-600/70 mt-1">
                        권장 기준 ({tier}): {authDetails?.criteria?.fakeThreshold ? `>${authDetails.criteria.fakeThreshold}%` : '기준 미달'}
                    </p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed text-left">
                    팔로워 대비 댓글 비율이 현저히 낮아 
                    가짜 팔로워(유령 계정) 구매가 의심되는 계정입니다.
                </p>
            </div>
            </div>
        </div>
    );
}

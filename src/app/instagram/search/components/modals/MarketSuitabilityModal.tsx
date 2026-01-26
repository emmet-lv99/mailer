import { InstagramUser } from "@/services/instagram/types";
import { X } from "lucide-react";

interface MarketSuitabilityModalProps {
    onClose: () => void;
    user: InstagramUser;
    isActive: boolean;
    avgCycle: number | null;
    tier: string;
}

export function MarketSuitabilityModal({ onClose, user, isActive, avgCycle, tier }: MarketSuitabilityModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-[400px] bg-white/95 p-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center text-center border-2 border-red-100 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            <h4 className="text-base font-bold text-red-900 mb-3">기준 미달 사유</h4>
            <div className="space-y-2 w-full px-1 text-left">
                    {/* 1. Followers Check */}
                <div className={`flex items-center justify-between text-xs p-2 rounded ${user.followers_count < 1000 ? 'bg-red-50 text-red-700 font-bold' : 'bg-gray-50 text-gray-400'}`}>
                    <span>1. 팔로워 1000명 이상</span>
                    <span>{user.followers_count < 1000 ? '미달' : '충족'}</span>
                </div>
                    {/* 2. Recency Check */}
                    <div className={`flex items-center justify-between text-xs p-2 rounded ${!isActive ? 'bg-red-50 text-red-700 font-bold' : 'bg-gray-50 text-gray-400'}`}>
                    <span>2. 최근 7일 내 게시물</span>
                    <span>{!isActive ? '미달' : '충족'}</span>
                </div>
                    {/* 3. Cycle Check */}
                    <div className={`flex items-center justify-between text-xs p-2 rounded ${!avgCycle || avgCycle > (tier === 'Nano' ? 3 : tier === 'Micro' || tier === 'Mid' ? 5 : 10) ? 'bg-red-50 text-red-700 font-bold' : 'bg-gray-50 text-gray-400'}`}>
                    <span>3. 업로드 주기</span>
                    <span>{avgCycle ? `${avgCycle}일` : '데이터 부족'}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">* 위 기준 중 하나라도 미달되면 섭외 대상에서 제외됩니다.</p>
            </div>
            </div>
        </div>
    );
}

import { CampaignResult } from "@/services/instagram/utils";
import { X } from "lucide-react";

interface CampaignSuitabilityModalProps {
    onClose: () => void;
    campaignResults: {
        sponsorship: CampaignResult;
        paidAd: CampaignResult;
        coPurchase: CampaignResult;
    };
}

export function CampaignSuitabilityModal({ onClose, campaignResults }: CampaignSuitabilityModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-[400px] bg-white/95 p-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center text-center border-2 border-purple-100 rounded-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"><X className="w-5 h-5" /></button>
            <h4 className="text-base font-bold text-purple-900 mb-4">캠페인 적합도 분석</h4>
            
            <div className="w-full space-y-3 px-1">
                {[
                    { id: 'sponsorship', label: '협찬 (관계 중시)', data: campaignResults.sponsorship },
                    { id: 'paidAd', label: '유료 광고 (도달 중시)', data: campaignResults.paidAd },
                    { id: 'coPurchase', label: '공동 구매 (전환 중시)', data: campaignResults.coPurchase }
                ].map((campaign) => (
                    <div key={campaign.id} className={`p-3 rounded-lg border flex items-center justify-between ${campaign.data.passed ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                        <div className="text-left">
                            <div className="text-xs font-bold text-gray-700">{campaign.label}</div>
                            <div className={`text-[10px] font-medium mt-0.5 ${campaign.data.passed ? 'text-purple-600' : 'text-gray-500'}`}>
                                {campaign.data.passed ? '적합' : '부적합'}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold font-mono leading-none text-purple-900">{campaign.data.score}점</div>
                            <div className="text-[10px] text-gray-500 font-bold mt-1 inline-block bg-white px-1.5 py-0.5 rounded border">
                                {campaign.data.grade}등급
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 text-[10px] text-gray-400 w-full text-center border-t pt-2">
                * 각 캠페인 목적에 따른 가중치가 적용된 점수입니다.
            </div>
            </div>
        </div>
    );
}

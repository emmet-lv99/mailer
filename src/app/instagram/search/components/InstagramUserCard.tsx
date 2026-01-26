import { InstagramUser } from "@/services/instagram/types";
import {
  calculateAuthenticity,
  calculateCampaignSuitability,
  calculateEngagementRate,
  getAccountGrade,
  getAccountTier,
  getAverageUploadCycle,
  getLatestPostDate,
  getProxiedUrl,
  GRADING_CRITERIA,
  isMarketSuitable,
  isUserActive
} from "@/services/instagram/utils";
import { Instagram } from "lucide-react";
import { useState } from "react";
import { AuthenticityModal } from "./modals/AuthenticityModal";
import { CampaignSuitabilityModal } from "./modals/CampaignSuitabilityModal";
import { FakeAccountModal } from "./modals/FakeAccountModal";
import { GradeExplanationModal } from "./modals/GradeExplanationModal";
import { MarketSuitabilityModal } from "./modals/MarketSuitabilityModal";

interface InstagramUserCardProps {
    user: InstagramUser;
    isSelected: boolean;
    isDisabled: boolean;
    onToggleSelection: (username: string) => void;
    onPostSelect: (post: any) => void;
}

export function InstagramUserCard({ 
    user, 
    isSelected, 
    isDisabled, 
    onToggleSelection, 
    onPostSelect 
}: InstagramUserCardProps) {
    const latestDate = getLatestPostDate(user);
    const isActive = isUserActive(latestDate);
    const avgCycle = getAverageUploadCycle(user.recent_posts);
    const { authenticityScore, isFake, details: authDetails } = calculateAuthenticity(user);
    
    // For Grade Explanation
    const er = calculateEngagementRate(user);
    const tier = getAccountTier(user.followers_count);
    const criteria = GRADING_CRITERIA[tier];
    
    // Campaign Suitability
    const campaignResults = calculateCampaignSuitability(user);

    const [showGradeModal, setShowGradeModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showMarketModal, setShowMarketModal] = useState(false);
    const [showFakeModal, setShowFakeModal] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);

    return (
        <div 
            className={`relative group border rounded-xl overflow-hidden bg-card transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""} ${isDisabled ? "opacity-60 bg-muted/50" : ""}`}
            onClick={() => !isDisabled && onToggleSelection(user.username)}
        >
            {/* Selection Overlay (Active on hover or selected) */}
            {!isDisabled && (
                <div className={`absolute top-3 left-3 z-10`}>
                    <input 
                        type="checkbox" 
                        className="accent-primary h-5 w-5 shadow-sm"
                        checked={isSelected}
                        onChange={(e) => { e.stopPropagation(); onToggleSelection(user.username); }}
                    />
                </div>
            )}

            {/* Header Section */}
            <div className="p-4 pb-2">
                <div className="flex items-start justify-between mb-3 pl-7"> 
                    {/* Badge */}
                    {isDisabled ? (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        user.db_status === 'todo' ? 'bg-blue-100 text-blue-700' : 
                        user.db_status === 'ignored' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                    }`}>
                        {user.db_status === 'todo' ? '관리중' : user.db_status === 'ignored' ? '제외됨' : '등록됨'}
                    </span>
                    ) : (
                        <div className="flex gap-2">
                            {/* Market Suitability / Grade Badge */}
                             {!isMarketSuitable(user, avgCycle) ? (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowMarketModal(true); }}
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 tracking-wider cursor-help hover:bg-red-200 transition-colors"
                                >
                                    기준 미달
                                </button>
                             ) : (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowGradeModal(true); }}
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 tracking-wider flex items-center gap-1 hover:bg-indigo-200 transition-colors"
                                >
                                    {tier} <span className="text-indigo-900 border-l border-indigo-200 pl-1 ml-1">{getAccountGrade(user)}</span>
                                </button>
                             )}

                             {/* Campaign Suitability Badge */}
                             <button
                                onClick={(e) => { e.stopPropagation(); setShowCampaignModal(true); }}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 tracking-wider hover:bg-purple-100 transition-colors"
                             >
                                캠페인 적합
                             </button>
                             
                             {/* Authenticity Badges */}
                             {isFake ? (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowFakeModal(true); }}
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 tracking-wider cursor-help hover:bg-orange-200 transition-colors"
                                >
                                    가짜 의심
                                </button>
                             ) : (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setShowAuthModal(true); }}
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 tracking-wider hover:bg-green-100 transition-colors"
                                >
                                    신뢰도 {authenticityScore}
                                </button>
                             )}
                        </div>
                    )}
                    
                    <a 
                        href={`https://instagram.com/${user.username}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Instagram className="w-4 h-4" />
                    </a>
                </div>

                <div className="flex flex-col items-center text-center gap-2">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-background shadow-sm">
                        {user.profile_pic_url ? (
                            <img src={getProxiedUrl(user.profile_pic_url)} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl">👤</span>
                        )}
                    </div>
                    {isActive && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" title="최근 1달 내 활동"></span>
                    )}
                </div>
                <div>
                    <div className="font-bold text-sm truncate max-w-[180px]">{user.full_name || user.username}</div>
                    <a 
                        href={`https://instagram.com/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-xs text-muted-foreground truncate max-w-[180px] hover:text-primary hover:underline cursor-pointer block"
                        onClick={(e) => e.stopPropagation()}
                    >
                        @{user.username}
                    </a>
                </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 divide-x border-y bg-muted/20">
                <div className="p-2 text-center">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">팔로워</div>
                    <div className="text-sm font-medium">{user.followers_count === -1 ? '?' : user.followers_count.toLocaleString()}</div>
                </div>
                <div className="p-2 text-center">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">평균 주기</div>
                    <div className="text-sm font-medium">{avgCycle ? `${avgCycle}일` : '-'}</div>
                </div>
            </div>

            {/* Recent Posts Gallery - 일반 게시물 + 릴스 구분 */}
            <div className="p-3 bg-muted/10">
                {/* Reels Section */}
                {user.recent_posts.filter(p => p.productType === 'clips').length > 0 && (
                    <div className="mb-3">
                        <div className="text-[10px] text-muted-foreground mb-2 flex justify-between items-center">
                            <span className="flex items-center gap-1">
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">REELS</span>
                                <span>{user.recent_posts.filter(p => p.productType === 'clips').length}개</span>
                            </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                            {user.recent_posts.filter(p => p.productType === 'clips').slice(0, 5).map((post, idx) => (
                                <div 
                                    key={`reel-${idx}`} 
                                    className="aspect-square rounded-md bg-muted overflow-hidden border relative cursor-pointer group"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (post?.imageUrl) onPostSelect(post);
                                    }}
                                >
                                    {post?.imageUrl ? (
                                        <img src={getProxiedUrl(post.imageUrl)} alt="" className="w-full h-full object-cover transition-transform hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground/30">•</div>
                                    )}
                                    {/* Reels Metrics Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-1 text-white text-[8px]">
                                            <span>👁 {(post.views || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Regular Posts Section */}
                <div className="text-[10px] text-muted-foreground mb-2 flex justify-between items-center">
                    <span>최근 게시물</span>
                    <span>{latestDate ? latestDate.toLocaleDateString() : '-'}</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                    {/* Show first 10 posts (2 rows of 5) */}
                    {user.recent_posts.slice(0, 10).map((post, idx) => (
                        <div 
                            key={idx} 
                            className="aspect-square rounded-md bg-muted overflow-hidden border relative cursor-pointer group"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (post?.imageUrl) onPostSelect(post);
                            }}
                        >
                            {post?.imageUrl ? (
                                <img src={getProxiedUrl(post.imageUrl)} alt="" className="w-full h-full object-cover transition-transform hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground/30">•</div>
                            )}
                            {/* Reels Badge */}
                            {post?.productType === 'clips' && (
                                <div className="absolute top-0.5 right-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[6px] px-1 py-0.5 rounded font-bold">
                                    R
                                </div>
                            )}
                            {/* Metrics Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-1 text-white text-[7px]">
                                    <span>❤️{(post?.likes || 0).toLocaleString()}</span>
                                    {(post?.views || 0) > 0 && <span>👁{(post?.views || 0).toLocaleString()}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals - Components */}
            {showGradeModal && (
                <GradeExplanationModal 
                    onClose={() => setShowGradeModal(false)}
                    tier={tier}
                    er={er}
                    authDetails={authDetails}
                />
            )}
            {showAuthModal && (
                <AuthenticityModal 
                    onClose={() => setShowAuthModal(false)}
                    authenticityScore={authenticityScore}
                    authDetails={authDetails}
                />
            )}
            {showCampaignModal && (
                <CampaignSuitabilityModal 
                    onClose={() => setShowCampaignModal(false)}
                    campaignResults={campaignResults}
                />
            )}
            {showMarketModal && (
                <MarketSuitabilityModal 
                    onClose={() => setShowMarketModal(false)}
                    user={user}
                    isActive={isActive}
                    avgCycle={avgCycle}
                    tier={tier}
                />
            )}
            {showFakeModal && (
                <FakeAccountModal 
                    onClose={() => setShowFakeModal(false)}
                    authDetails={authDetails}
                    tier={tier}
                />
            )}
        </div>
    );
}

import { InstagramUser } from "@/services/instagram/types";
import {
    getAverageUploadCycle,
    getCommunicationStats,
    getLatestPostDate,
    getProxiedUrl,
    isUserActive
} from "@/services/instagram/utils";
import { Search } from "lucide-react";

interface InstagramUserCardProps {
    user: InstagramUser;
    isSelected: boolean;
    isDisabled: boolean;
    onToggleSelection: (username: string) => void;
    onImageSelect: (imageUrl: string) => void;
}

export function InstagramUserCard({ 
    user, 
    isSelected, 
    isDisabled, 
    onToggleSelection, 
    onImageSelect 
}: InstagramUserCardProps) {
    const latestDate = getLatestPostDate(user);
    const isActive = isUserActive(latestDate);
    const avgCycle = getAverageUploadCycle(user.recent_posts);
    const commStats = getCommunicationStats(user);

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
                        <span className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground font-medium">검색됨</span>
                    )}
                    <a 
                        href={`https://instagram.com/${user.username}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Search className="w-4 h-4" />
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
            <div className="grid grid-cols-3 divide-x border-y bg-muted/20">
                <div className="p-2 text-center">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">팔로워</div>
                    <div className="text-sm font-medium">{user.followers_count === -1 ? '?' : user.followers_count.toLocaleString()}</div>
                </div>
                <div className="p-2 text-center">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">평균 주기</div>
                    <div className="text-sm font-medium">{avgCycle ? `${avgCycle}일` : '-'}</div>
                </div>
                <div className="p-2 text-center">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">소통 지수</div>
                    <div className={`text-sm font-bold ${commStats ? (commStats.replyRate >= 30 ? 'text-green-600' : commStats.replyRate >= 10 ? 'text-blue-600' : 'text-muted-foreground') : 'text-muted-foreground'}`}>
                        {commStats ? `${commStats.replyRate}%` : '-'}
                    </div>
                </div>
            </div>

            {/* Recent Posts Gallery */}
            <div className="p-3 bg-muted/10">
                <div className="text-[10px] text-muted-foreground mb-2 flex justify-between items-center">
                    <span>최근 게시물</span>
                    <span>{latestDate ? latestDate.toLocaleDateString() : '-'}</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                    {/* Always show 5 slots placeholder if empty */}
                    {Array.from({ length: 5 }).map((_, idx) => {
                        const post = user.recent_posts[idx];
                        return (
                            <div 
                            key={idx} 
                            className="aspect-square rounded-md bg-muted overflow-hidden border relative cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (post?.imageUrl) onImageSelect(post.imageUrl);
                            }}
                            >
                                {post?.imageUrl ? (
                                    <img src={getProxiedUrl(post.imageUrl)} alt="" className="w-full h-full object-cover transition-transform hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground/30">•</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

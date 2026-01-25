import { cn } from "@/lib/utils";
import { videoLayouts } from "../layout-data";
import { getName, PreviewProps, RemoveButton } from "./shared";

export const VideoPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => {
    const isStory = block.type === 'story-grid';
    const isFullVideo = block.type === 'full-width-video';
    const isSplitVideo = block.type === 'split-video';

    return (
        <div className={cn(
            baseClasses,
            "p-3 border border-rose-500/20",
            "bg-rose-500/10 hover:ring-2 hover:ring-rose-500 hover:ring-offset-2 hover:ring-offset-slate-900"
        )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">{getName(videoLayouts, block.type)}</span>
                <RemoveButton onClick={handleRemove} />
            </div>
            {isStory ? (
                <div className="flex gap-3 justify-center py-1 overflow-hidden">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-500/30 p-0.5">
                                <div className="w-full h-full rounded-full bg-rose-500/10" />
                            </div>
                            <div className="w-8 h-1 bg-rose-500/20 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : isFullVideo ? (
                <div className="w-full h-32 bg-rose-500/20 rounded-lg flex flex-col items-center justify-center gap-2 border border-rose-500/10 relative overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                    </div>
                    <span className="text-[9px] text-rose-200 font-medium uppercase tracking-tighter">Cinematic Experience</span>
                </div>
            ) : isSplitVideo ? (
                <div className="flex gap-3 h-32">
                    <div className="w-3/5 bg-rose-500/20 rounded-lg flex items-center justify-center border border-rose-500/10 relative">
                         <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
                         </div>
                    </div>
                    <div className="flex-1 space-y-2 py-2">
                         <div className="h-2 w-full bg-rose-500/30 rounded-full" />
                         <div className="h-2 w-2/3 bg-rose-500/20 rounded-full" />
                         <div className="mt-auto pt-2 space-y-1">
                            <div className="h-6 w-full bg-rose-500/40 rounded-md" />
                            <div className="h-6 w-full bg-rose-500/20 rounded-md" />
                         </div>
                    </div>
                </div>
            ) : (
                <div className="flex gap-2 overflow-hidden px-2">
                     {[1,2,3].map(i => (
                         <div key={i} className="w-20 aspect-[9/16] bg-rose-500/20 rounded-md border border-rose-500/10 relative overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 to-transparent" />
                            <div className="absolute bottom-1 left-1 w-2/3 h-1 bg-white/30 rounded-full" />
                         </div>
                     ))}
                </div>
            )}
        </div>
    );
};

export const SectionHeaderPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => {
    const isWithCategory = block.type === 'section-header-category';
    
    return (
        <div className={cn(
            baseClasses,
            "flex flex-col items-center justify-center border-y border-white/5 gap-2 relative group",
            isWithCategory ? "py-8" : "py-10",
            "hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-slate-900"
        )}>
            <div className="w-1/3 h-4 bg-white/20 rounded-md mb-1" />
            <div className="w-1/2 h-2 bg-white/10 rounded-full mb-2" />
            
            {isWithCategory && (
                <div className="flex gap-2 mt-2">
                     <div className="px-3 py-1.5 bg-indigo-500/40 rounded-full border border-indigo-500/50">
                        <div className="w-8 h-1.5 bg-white/60 rounded-full" />
                     </div>
                     <div className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <div className="w-8 h-1.5 bg-white/30 rounded-full" />
                     </div>
                     <div className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <div className="w-8 h-1.5 bg-white/30 rounded-full" />
                     </div>
                </div>
            )}

            <RemoveButton onClick={handleRemove} />
        </div>
    );
};

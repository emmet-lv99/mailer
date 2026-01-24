import { cn } from "@/lib/utils";
import { LayoutBlock } from "@/services/mall/types";
import { X } from "lucide-react";
import * as React from "react";
import {
    detailLayouts,
    listLayouts,
    mainLayouts,
    videoLayouts
} from "./layout-data";

interface LayoutBlockPreviewProps {
    block: LayoutBlock;
    borderRadius: string;
    onRemove: (id: string) => void;
}

const RemoveButton = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
    <button
       onClick={(e) => {
          e.stopPropagation();
          onClick(e);
       }}
       className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-slate-400 hover:text-white rounded-full flex items-center justify-center shadow-lg border border-white/10 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
    >
       <X className="w-3 h-3" />
    </button>
  );

export function LayoutBlockPreview({ block, borderRadius, onRemove }: LayoutBlockPreviewProps) {
    const handleRemove = () => onRemove(block.id);
    const getName = (layouts: any[], value: string) => layouts.find(l => l.value === value)?.name || value;

    // Helper to check for full-width types
    const isFullWidth = [
        'full-scroll', 'image-strap', 'full-video', 'full-image', 'carousel-center'
    ].includes(block.type);

    const baseClasses = cn(
        "relative group shrink-0 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
        isFullWidth ? "w-full rounded-none mx-0" : "mx-6 rounded-xl"
    );

    if (block.category === 'top-banner') {
        return (
            <div className={cn(
                baseClasses,
                "flex items-center justify-center border border-pink-500/30",
                "h-8 bg-pink-500/20 hover:ring-2 hover:ring-pink-500 hover:ring-offset-2 hover:ring-offset-slate-900",
                !isFullWidth && "rounded-md"
            )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
                <span className="text-[9px] text-pink-300 font-bold uppercase tracking-widest">{block.type}</span>
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'hero') {
        const isCarousel = block.type === 'carousel-center';
        
        return (
            <div className={cn(
                baseClasses,
                "flex items-center justify-center border border-indigo-500/30",
                "h-32 bg-indigo-500/20 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-slate-900",
                isCarousel && "overflow-hidden" // Ensure side peek items don't overflow the rounded container
            )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
                {isCarousel ? (
                    <div className="flex w-full h-full items-center justify-center gap-2 px-2 relative overflow-hidden">
                        {/* Left peek */}
                        <div className="w-12 h-[85%] bg-indigo-500/10 rounded-r-xl absolute -left-2 border-y border-r border-indigo-500/5" />
                        
                        {/* Main Center */}
                        <div className="w-4/5 h-full bg-indigo-500/30 rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 border border-indigo-400/20 z-10">
                            <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Center Banner</span>
                             <div className="w-1/2 h-1 bg-indigo-400/30 rounded-full" />
                        </div>
                        
                        {/* Right peek */}
                        <div className="w-12 h-[85%] bg-indigo-500/10 rounded-l-xl absolute -right-2 border-y border-l border-indigo-500/5" />
                        
                        {/* Dots */}
                        <div className="absolute bottom-2 flex gap-1 z-20">
                            <div className="w-1 h-1 rounded-full bg-indigo-300" />
                            <div className="w-1 h-1 rounded-full bg-indigo-500/30" />
                            <div className="w-1 h-1 rounded-full bg-indigo-500/30" />
                        </div>
                    </div>
                ) : (
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest pointer-events-none">
                        {getName(mainLayouts, block.type)}
                    </span>
                )}
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'sub') {
        return (
            <div className={cn(
                baseClasses,
                "flex items-center justify-center border border-orange-500/30",
                "h-12 bg-orange-500/20 hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
                {block.type === 'grid-2-banner' ? (
                    <div className="grid grid-cols-2 w-full h-full gap-2 p-1">
                        <div className="bg-orange-500/30 rounded-md" />
                        <div className="bg-yellow-500/30 rounded-md" />
                    </div>
                ) : block.type === 'coupon-banner' ? (
                    <div className="flex items-center justify-between w-full px-4">
                        <div className="w-8 h-8 rounded-full bg-orange-400/40" />
                        <div className="w-32 h-2 bg-orange-400/30 rounded-full" />
                    </div>
                ) : block.type === 'text-image-split' ? (
                     <div className="flex w-full h-full p-1 gap-2">
                        <div className="w-1/3 flex flex-col justify-center gap-1">
                            <div className="h-2 w-full bg-orange-500/30 rounded-full" />
                            <div className="h-2 w-2/3 bg-orange-500/30 rounded-full" />
                        </div>
                        <div className="flex-1 bg-orange-500/20 rounded-md" />
                     </div>
                ) : (
                    <div className="w-2/3 h-1.5 bg-orange-500/40 rounded-full" />
                )}
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'product-list') {
        const isScroll = block.type === 'scroll-h';
        const cols = block.type === 'grid-5' ? 5 : block.type === 'grid-3' ? 3 : block.type === 'grid-2' ? 2 : 4;
        
        return (
            <div className={cn(
                baseClasses,
                "p-2 border border-emerald-500/20",
                "bg-emerald-500/10 hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
                <div className={cn("grid gap-2", 
                    isScroll ? "flex overflow-hidden" : 
                    cols === 5 ? "grid-cols-5" : 
                    cols === 3 ? "grid-cols-3" : 
                    cols === 2 ? "grid-cols-2" : "grid-cols-4"
                )}>
                    {[1, 2, 3, 4, 5].slice(0, isScroll ? 5 : cols).map(i => (
                        <div key={i} className={cn("bg-emerald-500/20 rounded-md", isScroll ? "w-16 h-16 shrink-0 aspect-square" : "aspect-square")} />
                    ))}
                </div>
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'category-product') {
        return (
            <div className={cn(
                baseClasses,
                "p-2 space-y-2 border border-cyan-500/20",
                "bg-cyan-500/10 hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
                {block.type === 'magazine-3' ? (
                    <div className="grid grid-cols-3 gap-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="aspect-[4/5] bg-cyan-700/20 rounded-md flex flex-col justify-end p-1 gap-1">
                                <div className="h-1 w-full bg-cyan-500/40" />
                                <div className="h-3 w-full bg-cyan-500/20" />
                            </div>
                        ))}
                    </div>
                ) : block.type === 'review-4' ? (
                    <div className="grid grid-cols-4 gap-2">
                       {[1,2,3,4].map(i => (
                           <div key={i} className="aspect-square bg-cyan-300/10 rounded-md border border-cyan-500/10 p-1">
                               <div className="w-full h-3/4 bg-cyan-500/10 rounded-sm mb-1" />
                               <div className="w-1/2 h-1 bg-cyan-500/30" />
                           </div>
                       ))}
                    </div>
                ) : (
                    <>
                    <div className="flex gap-2 justify-center pb-1 border-b border-cyan-500/10">
                        {[1, 2, 3].map(i => <div key={i} className="w-12 h-1.5 bg-cyan-500/30 rounded-full" />)}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] bg-cyan-500/20 rounded-md" />)}
                    </div>
                    </>
                )}
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'shorts' || block.category === 'video-product') {
        const isStory = block.type === 'story-grid';
        const isFullVideo = block.type === 'full-video';
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
    }

    // List Page Blocks
    if (block.category === 'list') {
        const isBanner = block.type === 'banner';
        const cols = block.type === 'grid-5' ? 5 : block.type === 'grid-4' ? 4 : block.type === 'grid-3' ? 3 : block.type === 'grid-2' ? 2 : 1;
        
        return (
            <div className={cn(
               baseClasses,
               "bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0 flex flex-col gap-2",
               "hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{getName(listLayouts, block.type)}</span>
                    <RemoveButton onClick={handleRemove} />
                 </div>
                 
                 {isBanner ? (
                    <div className="w-full h-24 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/10">
                        <span className="text-xs text-blue-300 font-bold">BANNER AREA</span>
                    </div>
                 ) : (
                    <div className={cn("grid gap-2", 
                        cols === 5 ? "grid-cols-5" : 
                        cols === 4 ? "grid-cols-4" : 
                        cols === 3 ? "grid-cols-3" : 
                        cols === 2 ? "grid-cols-2" : "grid-cols-1"
                    )}>
                        {[1, 2, 3, 4, 5].slice(0, cols === 1 ? 2 : cols).map(i => (
                          <div key={i} className={cn("bg-blue-500/20 rounded-md p-1", cols === 1 ? "flex gap-2 h-16" : "aspect-[3/4] flex flex-col gap-1")}>
                              {cols === 1 ? (
                                  <>
                                    <div className="h-full aspect-square bg-blue-500/10 rounded-sm" />
                                    <div className="flex-1 flex flex-col gap-1 justify-center">
                                         <div className="h-2 w-3/4 bg-blue-500/20 rounded-full" />
                                         <div className="h-2 w-1/2 bg-blue-500/10 rounded-full" />
                                    </div>
                                  </>
                              ) : (
                                  <>
                                    <div className="flex-1 bg-blue-500/10 rounded-sm" />
                                    <div className="h-1 bg-blue-500/20 w-2/3 rounded-sm" />
                                  </>
                              )}
                          </div>
                        ))}
                    </div>
                 )}
            </div>
        );
    }

    // Detail Page Blocks
    if (block.category === 'detail') {
        return (
            <div className={cn(
               baseClasses,
               "bg-purple-500/10 border border-purple-500/20 p-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
               "hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 hover:ring-offset-slate-900",
               !isFullWidth && "rounded-xl"
            )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{getName(detailLayouts, block.type)}</span>
                    <RemoveButton onClick={handleRemove} />
                 </div>

                 {block.type === 'product-hero' ? (
                     <div className="flex gap-4">
                         {/* Left: Gallery */}
                         <div className="w-1/2 space-y-2">
                            <div className="aspect-square bg-purple-500/20 rounded-md border border-purple-500/10" />
                            <div className="flex gap-1">
                                <div className="w-1/4 aspect-square bg-purple-500/20 rounded-sm" />
                                <div className="w-1/4 aspect-square bg-purple-500/10 rounded-sm" />
                                <div className="w-1/4 aspect-square bg-purple-500/10 rounded-sm" />
                            </div>
                         </div>
                         {/* Right: Info */}
                         <div className="w-1/2 flex flex-col gap-2">
                             <div className="h-4 w-3/4 bg-purple-500/30 rounded-full" />
                             <div className="h-2 w-1/2 bg-purple-500/20 rounded-full mb-2" />
                             
                             <div className="space-y-1 p-2 bg-purple-500/5 rounded-md border border-purple-500/10">
                                <div className="h-1.5 w-full bg-purple-500/10 rounded-full" />
                                <div className="h-1.5 w-full bg-purple-500/10 rounded-full" />
                                <div className="h-1.5 w-2/3 bg-purple-500/10 rounded-full" />
                             </div>
                             
                             <div className="mt-auto flex gap-2">
                                 <div className="flex-1 h-8 bg-purple-500/20 rounded-md flex items-center justify-center">
                                     <div className="w-12 h-1.5 bg-purple-500/40 rounded-full" />
                                 </div>
                                 <div className="w-8 h-8 bg-purple-500/10 rounded-md" />
                             </div>
                         </div>
                     </div>
                 ) : block.type === 'sticky-tabs' ? (
                     <div className="w-full h-10 bg-purple-500/5 rounded-md border border-purple-500/10 flex items-center px-4 gap-6">
                         <div className="flex flex-col gap-1">
                             <div className="w-12 h-2 bg-purple-500/50 rounded-full" />
                             <div className="w-full h-0.5 bg-purple-500" />
                         </div>
                         <div className="w-12 h-2 bg-purple-500/20 rounded-full" />
                         <div className="w-12 h-2 bg-purple-500/20 rounded-full" />
                         <div className="w-12 h-2 bg-purple-500/20 rounded-full" />
                     </div>
                 ) : block.type === 'detail-body' ? (
                     <div className="w-full aspect-[4/5] bg-purple-500/10 rounded-md border border-purple-500/5 flex flex-col items-center justify-center gap-2">
                         <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                             <div className="w-16 h-1 bg-purple-500/20 rotate-45" />
                         </div>
                         <div className="w-1/2 h-2 bg-purple-500/10 rounded-full" />
                     </div>
                 ) : block.type === 'review-board' ? (
                    <div className="space-y-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex gap-2 p-2 bg-purple-500/5 rounded-md">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20" />
                                <div className="flex-1 space-y-1">
                                    <div className="w-1/3 h-2 bg-purple-500/20 rounded-full" />
                                    <div className="w-2/3 h-1.5 bg-purple-500/10 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : block.type === 'split-view' ? (
                     <div className="flex gap-2 h-20">
                        <div className="w-1/3 bg-purple-500/20 rounded-md" />
                        <div className="flex-1 space-y-1">
                           <div className="h-3 w-3/4 bg-purple-500/20 rounded-sm" />
                           <div className="h-2 w-1/2 bg-purple-500/10 rounded-sm" />
                           <div className="h-8 w-full bg-purple-500/5 rounded-sm mt-2" />
                        </div>
                     </div>
                 ) : (
                    <div className="space-y-2">
                        <div className="w-full h-24 bg-purple-500/20 rounded-md" />
                        <div className="h-3 w-full bg-purple-500/20 rounded-sm" />
                    </div>
                 )}
            </div>
        );
    }

    return null;
}

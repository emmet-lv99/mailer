import { cn } from "@/lib/utils";
import { LayoutBlock } from "@/services/mall/types";
import { X } from "lucide-react";
import * as React from "react";
import {
    detailLayouts,
    listLayouts,
    mainLayouts
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
        'wide-slider', 'full-scroll', 'image-strap', 'full-video', 'full-image'
    ].includes(block.type);

    const baseClasses = cn(
        "relative group shrink-0 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
        isFullWidth ? "-mx-2 w-[calc(100%+16px)] rounded-none" : "w-full rounded-xl"
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
        const isSlider = block.type === 'wide-slider';
        const isCarousel = block.type === 'carousel-center';
        
        return (
            <div className={cn(
                baseClasses,
                "flex items-center justify-center border border-indigo-500/30",
                "h-32 bg-indigo-500/20 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-slate-900",
                isCarousel && "overflow-hidden" // Ensure side peek items don't overflow the rounded container
            )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
                {isSlider ? (
                     <div className="flex w-full h-full p-2 gap-2 overflow-hidden">
                        <div className="flex-1 bg-indigo-400/20 rounded-lg flex items-center justify-center">
                           <span className="text-[10px] text-indigo-300 font-bold uppercase">SLIDE 1</span>
                        </div>
                        <div className="w-4 bg-indigo-400/10 rounded-r-lg" />
                     </div>
                ) : isCarousel ? (
                    <div className="flex w-full h-full items-center justify-center gap-4 px-4 relative">
                        {/* Left peek */}
                        <div className="w-4 h-5/6 bg-indigo-500/10 rounded-l-lg absolute -left-2" />
                        
                        {/* Main Center */}
                        <div className="w-3/4 h-5/6 bg-indigo-500/30 rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 border border-indigo-400/20">
                            <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Center Banner</span>
                            <div className="w-1/2 h-1 bg-indigo-400/30 rounded-full" />
                        </div>
                        
                        {/* Right peek */}
                        <div className="w-4 h-5/6 bg-indigo-500/10 rounded-r-lg absolute -right-2" />
                        
                        {/* Dots */}
                        <div className="absolute bottom-1 flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-indigo-400" />
                            <div className="w-1 h-1 rounded-full bg-indigo-400/30" />
                            <div className="w-1 h-1 rounded-full bg-indigo-400/30" />
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

    // List Page Blocks
    if (block.category === 'list') {
        const isGrid3 = block.type === 'grid-3';
        const isGrid2 = block.type === 'grid-2';
        
        return (
            <div className={cn(
               "w-full bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0 flex flex-col gap-2",
               "hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius }}>
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{getName(listLayouts, block.type)}</span>
                    <RemoveButton onClick={handleRemove} />
                 </div>
                 
                 <div className={cn("grid gap-2", isGrid3 ? "grid-cols-3" : isGrid2 ? "grid-cols-2" : "grid-cols-1")}>
                    {[1,2,3].slice(0, isGrid2 ? 2 : 3).map(i => (
                      <div key={i} className="aspect-[3/4] bg-blue-500/20 rounded-md flex flex-col gap-1 p-1">
                          <div className="flex-1 bg-blue-500/10 rounded-sm" />
                          <div className="h-1 bg-blue-500/20 w-2/3 rounded-sm" />
                      </div>
                    ))}
                 </div>
            </div>
        );
    }

    // Detail Page Blocks
    if (block.category === 'detail') {
        return (
            <div className={cn(
               "w-full bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
               "hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius }}>
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{getName(detailLayouts, block.type)}</span>
                    <RemoveButton onClick={handleRemove} />
                 </div>

                 {block.type === 'split-view' && (
                     <div className="flex gap-2 h-20">
                        <div className="w-1/3 bg-purple-500/20 rounded-md" />
                        <div className="flex-1 space-y-1">
                           <div className="h-3 w-3/4 bg-purple-500/20 rounded-sm" />
                           <div className="h-2 w-1/2 bg-purple-500/10 rounded-sm" />
                           <div className="h-8 w-full bg-purple-500/5 rounded-sm mt-2" />
                        </div>
                     </div>
                 )}
                 {block.type !== 'split-view' && (
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

import { cn } from "@/lib/utils";
import { LayoutBlock } from "@/services/mall/types";
import { Play, X } from "lucide-react";
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

    if (block.category === 'top-banner') {
        return (
            <div className={cn(
                "w-full bg-pink-500/20 border border-pink-500/30 rounded-md flex items-center justify-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                "h-8 hover:ring-2 hover:ring-pink-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius }}>
                <span className="text-[9px] text-pink-300 font-bold uppercase tracking-widest">{block.type}</span>
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'hero') {
        return (
            <div className={cn(
                "w-full bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                "h-32 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius }}>
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest pointer-events-none">
                    {getName(mainLayouts, block.type)}
                </span>
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'sub') {
        return (
            <div className={cn(
                "w-full bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                "h-12 hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius }}>
                <div className="w-2/3 h-1.5 bg-orange-500/40 rounded-full" />
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'product-list') {
        return (
            <div className={cn(
                "w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                "hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius }}>
                <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-emerald-500/20 rounded-md" />)}
                </div>
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'category-product') {
        return (
            <div className={cn(
                "w-full bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0 space-y-2",
                "hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius }}>
                <div className="flex gap-2 justify-center pb-1 border-b border-cyan-500/10">
                    {[1, 2, 3].map(i => <div key={i} className="w-12 h-1.5 bg-cyan-500/30 rounded-full" />)}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] bg-cyan-500/20 rounded-md" />)}
                </div>
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'shorts') {
        return (
            <div className={cn(
                "w-full bg-rose-500/10 border border-rose-500/20 rounded-xl p-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                "hover:ring-2 hover:ring-rose-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius }}>
                <div className="flex gap-2 overflow-hidden">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-16 h-24 bg-rose-500/20 rounded-lg border border-rose-500/10 flex items-center justify-center shrink-0">
                            <Play className="w-3 h-3 text-rose-500/50 fill-rose-500/50" />
                        </div>
                    ))}
                </div>
                <RemoveButton onClick={handleRemove} />
            </div>
        );
    }

    if (block.category === 'video-product') {
        return (
            <div className={cn(
                "w-full bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                "h-48 hover:ring-2 hover:ring-violet-500 hover:ring-offset-2 hover:ring-offset-slate-900"
            )} style={{ borderRadius }}>
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                    <Play className="w-5 h-5 text-violet-300 ml-1 fill-violet-300" />
                </div>
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

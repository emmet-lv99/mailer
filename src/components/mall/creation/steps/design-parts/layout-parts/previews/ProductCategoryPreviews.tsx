import { cn } from "@/lib/utils";
import { productListLayouts } from "../layout-data";
import { getName, PreviewProps, RemoveButton } from "./shared";

export const ProductListPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => {
    const isScroll = block.type === 'scroll-h';
    const cols = block.type === 'grid-5' ? 5 : block.type === 'grid-3' ? 3 : block.type === 'grid-2' ? 2 : 4;
    
    return (
        <div className={cn(
            baseClasses,
            "p-2 border border-emerald-500/20",
            "bg-emerald-500/10 hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 hover:ring-offset-slate-900"
        )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{getName(productListLayouts, block.type)}</span>
                <RemoveButton onClick={handleRemove} />
            </div>
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
        </div>
    );
};

export const CategoryProductPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => (
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

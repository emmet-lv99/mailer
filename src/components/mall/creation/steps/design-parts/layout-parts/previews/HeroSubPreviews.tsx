import { cn } from "@/lib/utils";
import { mainLayouts } from "../layout-data";
import { getName, PreviewProps, RemoveButton } from "./shared";

export const HeroPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => {
    const isCarousel = block.type === 'carousel-center';
    
    return (
        <div className={cn(
            baseClasses,
            "flex items-center justify-center border border-indigo-500/30",
            "h-32 bg-indigo-500/20 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-slate-900",
            isCarousel && "overflow-hidden"
        )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
            {isCarousel ? (
                <div className="flex w-full h-full items-center justify-center gap-2 px-2 relative overflow-hidden">
                    <div className="w-12 h-[85%] bg-indigo-500/10 rounded-r-xl absolute -left-2 border-y border-r border-indigo-500/5" />
                    <div className="w-4/5 h-full bg-indigo-500/30 rounded-lg shadow-lg flex flex-col items-center justify-center gap-2 border border-indigo-400/20 z-10">
                        <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Center Banner</span>
                        <div className="w-1/2 h-1 bg-indigo-400/30 rounded-full" />
                    </div>
                    <div className="w-12 h-[85%] bg-indigo-500/10 rounded-l-xl absolute -right-2 border-y border-l border-indigo-500/5" />
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
};

export const SubBannerPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => {
    const isGrid2 = block.type === 'grid-2-banner';
    const isGrid3 = block.type === 'grid-3-banner';
    const isPromo = block.type === 'promotion-bar';

    return (
        <div className={cn(
            baseClasses,
            "flex items-center justify-center border border-orange-500/30",
            "h-16 bg-orange-500/10 hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 hover:ring-offset-slate-900"
        )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
            {isGrid2 ? (
                <div className="grid grid-cols-2 w-full h-full gap-2 p-2">
                    <div className="bg-orange-500/20 rounded-md border border-orange-500/10" />
                    <div className="bg-orange-500/20 rounded-md border border-orange-500/10" />
                </div>
            ) : isGrid3 ? (
                <div className="grid grid-cols-3 w-full h-full gap-2 p-2">
                    <div className="bg-orange-500/20 rounded-md border border-orange-500/10" />
                    <div className="bg-orange-500/20 rounded-md border border-orange-500/10" />
                    <div className="bg-orange-500/20 rounded-md border border-orange-500/10" />
                </div>
            ) : isPromo ? (
                <div className="flex items-center justify-center w-full px-4 h-full">
                    <div className="w-2/3 h-1.5 bg-orange-500/40 rounded-full" />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                     <div className="w-1/2 h-2 bg-orange-500/30 rounded-full" />
                     <div className="w-1/4 h-1 bg-orange-500/20 rounded-full" />
                </div>
            )}
            <RemoveButton onClick={handleRemove} />
        </div>
    );
};

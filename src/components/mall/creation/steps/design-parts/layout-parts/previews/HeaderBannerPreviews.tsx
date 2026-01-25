import { cn } from "@/lib/utils";
import { PreviewProps, RemoveButton } from "./shared";

export const HeaderPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => {
    const isSideNav = block.type === 'side-nav-header';
    const isStackedCenter = block.type === 'stacked-center-header';

    return (
        <div className={cn(
            baseClasses,
            "flex flex-col border border-sky-500/30 bg-sky-500/10 hover:ring-2 hover:ring-sky-500 hover:ring-offset-2 hover:ring-offset-slate-900",
            isSideNav ? "h-12 px-4 justify-center" : "h-24 px-4 py-3 justify-between",
            !isFullWidth && "rounded-lg"
        )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
            {isSideNav ? (
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-sky-500/50 flex items-center justify-center text-[8px] font-black text-white">B</div>
                       <div className="flex gap-3">
                          <div className="w-10 h-1 bg-sky-500/30 rounded-full" />
                          <div className="w-12 h-1 bg-sky-500/30 rounded-full" />
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-sm border border-sky-500/30" />
                       <div className="w-3 h-3 rounded-sm border border-sky-500/30" />
                       <div className="w-3 h-3 rounded-sm border border-sky-500/30" />
                    </div>
                </div>
            ) : isStackedCenter ? (
                <>
                    <div className="flex justify-center w-full">
                        <div className="w-16 h-8 bg-sky-500/40 rounded-sm flex items-center justify-center">
                            <div className="w-10 h-1 bg-sky-500/20 rounded-full" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full pt-2 border-t border-sky-500/10">
                        <div className="flex gap-3">
                            <div className="w-8 h-1 bg-sky-500/20 rounded-full" />
                            <div className="w-8 h-1 bg-sky-500/20 rounded-full" />
                            <div className="w-8 h-1 bg-sky-500/20 rounded-full" />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-sky-500/30" />
                            <div className="w-3 h-3 rounded-full bg-sky-500/30" />
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2/3 h-1.5 bg-sky-500/40 rounded-full" />
                </div>
            )}
            <RemoveButton onClick={handleRemove} />
        </div>
    );
};

export const TopBannerPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => (
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

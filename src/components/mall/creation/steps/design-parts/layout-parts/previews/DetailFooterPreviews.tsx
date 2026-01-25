import { cn } from "@/lib/utils";
import { detailLayouts } from "../layout-data";
import { getName, PreviewProps, RemoveButton } from "./shared";

export const DetailPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => (
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
                 <div className="w-1/2 space-y-2">
                    <div className="aspect-square bg-purple-500/20 rounded-md border border-purple-500/10" />
                    <div className="flex gap-1">
                        <div className="w-1/4 aspect-square bg-purple-500/20 rounded-sm" />
                        <div className="w-1/4 aspect-square bg-purple-500/10 rounded-sm" />
                        <div className="w-1/4 aspect-square bg-purple-500/10 rounded-sm" />
                    </div>
                 </div>
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
         ) : (
            <div className="space-y-2">
                <div className="w-full h-24 bg-purple-500/20 rounded-md" />
                <div className="h-3 w-full bg-purple-500/20 rounded-sm" />
            </div>
         )}
    </div>
);

export const FooterPreview = ({ block, borderRadius, isFullWidth, baseClasses, handleRemove }: PreviewProps) => (
    <div className={cn(
       baseClasses,
       "bg-slate-800 border border-slate-700 p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
       "hover:ring-2 hover:ring-slate-500 hover:ring-offset-2 hover:ring-offset-slate-900 border-t-2 border-t-white/10",
       !isFullWidth && "rounded-xl"
    )} style={{ borderRadius: isFullWidth ? '0px' : borderRadius }}>
         <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-6 bg-slate-700/50 rounded flex items-center justify-center text-[6px] font-black text-white/40">BRAND</div>
            <RemoveButton onClick={handleRemove} />
         </div>
         
         <div className="flex gap-3 mb-6">
            {[1,2,3,4].map(i => <div key={i} className="w-8 h-1 bg-slate-700 rounded-full" />)}
         </div>

         <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
                <div className="w-full h-1 bg-slate-700/60 rounded-full" />
                <div className="w-2/3 h-1 bg-slate-700/40 rounded-full" />
                <div className="w-3/4 h-1 bg-slate-700/40 rounded-full" />
            </div>
            <div className="space-y-1 border-l border-slate-700/30 pl-4">
                <div className="w-full h-1 bg-slate-700/60 rounded-full" />
                <div className="w-1/2 h-1 bg-slate-700/40 rounded-full" />
            </div>
            <div className="space-y-1 border-l border-slate-700/30 pl-4">
                <div className="w-full h-1 bg-slate-700/60 rounded-full" />
                <div className="w-2/3 h-1 bg-slate-700/40 rounded-full" />
            </div>
         </div>

         <div className="pt-4 border-t border-slate-700/30 flex justify-between items-center">
            <div className="w-24 h-1 bg-slate-700/30 rounded-full" />
            <div className="flex gap-1.5">
                {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-3 rounded-full bg-slate-700/50" />)}
            </div>
         </div>
    </div>
);

import { LayoutBlock } from "@/services/mall/types";

export function LiveHeroBlock({ block, mockupStyle }: { block: LayoutBlock; mockupStyle?: string }) {
  // 1. Carousel Center
  if (block.type === 'carousel-center') {
    return (
      <div className="w-full h-[600px] bg-[var(--bg-sub)] relative overflow-hidden flex items-center justify-center">
         {/* Side Peeks */}
         <div className="absolute left-[-10%] w-[20%] h-[80%] bg-[var(--brand-secondary)] opacity-10 rounded-xl" />
         <div className="absolute right-[-10%] w-[20%] h-[80%] bg-[var(--brand-secondary)] opacity-10 rounded-xl" />
         
         {/* Main Banner */}
         <div className="w-[1280px] h-full bg-[var(--brand-primary)] opacity-5 relative flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[var(--brand-primary)]/20 rounded-xl m-8 box-border">
            <span className="text-[var(--brand-primary)] font-bold text-6xl font-[family-name:var(--font-display)] mb-4 opacity-20">
              AI IMAGE AREA
            </span>
            <p className="text-[var(--text-body)] text-xl max-w-2xl font-[family-name:var(--font-body)] opacity-60">
               Next Step: Generate High-Fidelity Hero Image
               {mockupStyle && <span className="block text-sm mt-2 text-indigo-400 font-mono">Style: {mockupStyle}</span>}
            </p>
         </div>

         {/* Navigation Dots */}
         <div className="absolute bottom-8 flex gap-3">
            <div className="w-3 h-3 rounded-full bg-[var(--brand-primary)]" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
         </div>
      </div>
    );
  }

  // 2. Hero Grid
  if (block.type === 'hero') {
    return (
      <div className="w-full grid grid-cols-12 gap-4 h-[600px]">
        {/* Main Hero */}
        <div className="col-span-8 bg-gray-100 rounded-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-[var(--brand-secondary)] opacity-5" />
            <span className="relative z-10 font-[family-name:var(--font-display)] text-5xl font-bold text-[var(--text-title)]">
              EDITORIAL<br/>GRID HERO
            </span>
         </div>
         
         {/* Sub Grid (40%) */}
         <div className="col-span-4 grid grid-rows-2 gap-4">
            <div className="bg-[var(--bg-sub)] rounded-[var(--border-radius)] flex items-center justify-center relative overflow-hidden">
               <span className="font-bold text-[var(--brand-primary)] opacity-50">SUB 01</span>
            </div>
            <div className="bg-[var(--bg-sub)] rounded-[var(--border-radius)] flex items-center justify-center relative overflow-hidden">
               <span className="font-bold text-[var(--brand-primary)] opacity-50">SUB 02</span>
            </div>
         </div>
      </div>
    );
  }

  return <div className="p-8 bg-red-100 text-red-500">Unknown Hero Type: {block.type}</div>;
}

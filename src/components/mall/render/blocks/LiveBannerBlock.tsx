import { LayoutBlock } from "@/services/mall/types";

export function LiveBannerBlock({ block, mockupStyle }: { block: LayoutBlock; mockupStyle?: string }) {
  
  // 1. Image Strap (Full Width)
  if (block.type === 'image-strap') {
    return (
      <div className="w-full h-[400px] bg-[var(--text-title)] flex items-center justify-center text-white/20 relative overflow-hidden border-y border-dashed border-white/10">
         <span className="font-[family-name:var(--font-display)] text-4xl tracking-[0.2em] uppercase">
            Full Screen AI Image
            {mockupStyle && <span className="block text-sm mt-2 text-center text-white/40 font-mono normal-case tracking-normal">Style: {mockupStyle}</span>}
         </span>
         <div className="absolute inset-0 bg-[var(--brand-primary)] mix-blend-overlay opacity-20" />
      </div>
    );
  }

  // 2. Promotion Bar
  if (block.type === 'promotion-bar') {
    return (
      <div className="w-full h-[60px] bg-[var(--brand-primary)] flex items-center justify-center text-white px-4">
         <span className="font-bold text-sm tracking-wide opacity-80">
            PROMOTION BANNER AREA
         </span>
      </div>
    );
  }

  // 3. Grid 2 Banner
  if (block.type === 'grid-2-banner') {
    return (
      <div className="container mx-auto px-4 grid grid-cols-2 gap-5 h-[280px]">
         <div className="bg-[var(--bg-sub)] rounded-[var(--border-radius)] flex flex-col justify-center p-8 border border-black/5">
            <div className="h-8 w-1/2 bg-[var(--text-title)] opacity-10 mb-2 rounded-sm" />
            <div className="h-4 w-1/4 bg-[var(--text-body)] opacity-10 rounded-sm" />
         </div>
         <div className="bg-[var(--bg-sub)] rounded-[var(--border-radius)] flex flex-col justify-center p-8 border border-black/5">
            <div className="h-8 w-1/2 bg-[var(--text-title)] opacity-10 mb-2 rounded-sm" />
            <div className="h-4 w-1/4 bg-[var(--text-body)] opacity-10 rounded-sm" />
         </div>
      </div>
    );
  }

  // 4. Grid 3 Banner
  if (block.type === 'grid-3-banner') {
    return (
      <div className="container mx-auto px-4 grid grid-cols-3 gap-4 h-[320px]">
         {[1, 2, 3].map(i => (
           <div key={i} className="bg-[var(--bg-sub)] rounded-[var(--border-radius)] flex flex-col items-center justify-end p-6 border border-black/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[var(--brand-secondary)] opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="h-6 w-1/2 bg-[var(--text-title)] opacity-10 mb-1 rounded-sm" />
              <div className="h-3 w-1/3 bg-[var(--text-body)] opacity-10 rounded-sm" />
           </div>
         ))}
      </div>
    );
  }

  // 5. Top Banner / Text Bar (Simple Announcement)
  if (block.type === 'top-banner' || block.type === 'text-bar') {
    return (
      <div className="w-full h-[40px] bg-[var(--text-title)] flex items-center justify-center text-white px-4 text-xs font-medium tracking-wide">
         <span className="opacity-70">Top Announcement Bar</span>
      </div>
    );
  }

  return <div className="p-4 bg-gray-100">Unknown Banner: {block.type}</div>;
}

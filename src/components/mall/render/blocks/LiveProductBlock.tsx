import { LayoutBlock } from "@/services/mall/types";
import { Sparkles } from "lucide-react";

export function LiveProductBlock({ block, mockupStyle }: { block: LayoutBlock; mockupStyle?: string }) {
  let columns = 4;
  let gap = "gap-5";
  
  if (block.type === 'grid-5') {
    columns = 5;
    gap = "gap-5";
  } else if (block.type === 'grid-4') {
    columns = 4;
    gap = "gap-5";
  } else if (block.type === 'grid-3') {
    columns = 3;
    gap = "gap-10";
  } else if (block.type === 'grid-2') {
    columns = 2;
    gap = "gap-20";
  }

  // Generate 8-10 items
  const items = Array.from({ length: columns * 2 });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`grid grid-cols-2 md:grid-cols-${columns} ${gap}`}>
        {items.map((_, i) => (
          <div key={i} className="group cursor-default">
             {/* Image placeholder */}
             <div className="aspect-[3/4] w-full bg-[#f4f4f5] border border-dashed border-gray-200 rounded-lg relative overflow-hidden mb-4 flex flex-col items-center justify-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide opacity-70">AI Image Pending</span>
                {mockupStyle && <span className="text-[9px] text-indigo-500 font-medium">Style: {mockupStyle}</span>}
              </div>
             
             {/* Info Skeleton */}
             <div className="space-y-2">
                <div className="h-2.5 w-1/3 bg-gray-100 rounded-sm" />
                <div className="h-3 w-3/4 bg-gray-100 rounded-sm" />
                <div className="flex items-center gap-2 mt-2">
                   <div className="h-3 w-1/4 bg-gray-200 rounded-sm" />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

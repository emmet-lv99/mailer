"use client";

import { CheckCircle2, ZoomIn } from "lucide-react";
import { useState } from "react";

interface DesignVariantGridProps {
  variants: string[]; // Base64 strings
  selectedImage: string | null;
  onSelect: (image: string) => void;
  isLoading: boolean;
}

export function DesignVariantGrid({ variants, selectedImage, onSelect, isLoading }: DesignVariantGridProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[3/4] bg-slate-200 rounded-xl border-4 border-white shadow-sm" />
        ))}
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
          🎨
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-800">아직 생성된 시안이 없습니다.</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm">
            상단의 '시안 생성하기' 버튼을 눌러 AI가 제안하는 디자인을 확인해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {variants.map((img, idx) => {
        const isSelected = selectedImage === img;
        const base64Src = img.startsWith('data:') ? img : `data:image/png;base64,${img}`;
        
        return (
          <div 
            key={idx}
            onClick={() => onSelect(img)}
            className={`
              relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group
              ${isSelected ? "ring-4 ring-blue-500 shadow-2xl scale-105" : "hover:scale-[1.02] hover:shadow-xl border-4 border-white shadow-md"}
            `}
          >
            <img 
              src={base64Src} 
              alt={`Variant ${idx + 1}`} 
              className="w-full h-full object-cover"
            />
            
            {/* Selection Overlay */}
            {isSelected && (
              <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                <div className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            )}

            {/* Hover Actions */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); setZoomedImage(base64Src); }}
                className="bg-white/90 p-2 rounded-lg shadow-sm hover:bg-white text-slate-600"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Label */}
            <div className="absolute top-4 left-4">
              <span className="bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
                Variant 0{idx + 1}
              </span>
            </div>
          </div>
        );
      })}

      {/* Zoom Modal (Simple) */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-10"
          onClick={() => setZoomedImage(null)}
        >
          <img src={zoomedImage} className="max-w-full max-h-full rounded-lg shadow-2xl" />
          <button className="absolute top-10 right-10 text-white text-2xl">✕</button>
        </div>
      )}
    </div>
  );
}

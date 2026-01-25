import { LayoutBlock } from "@/services/mall/types";
import { X } from "lucide-react";
import * as React from "react";

export interface PreviewProps {
    block: LayoutBlock;
    borderRadius: string;
    isFullWidth: boolean;
    baseClasses: string;
    handleRemove: () => void;
}

export const getName = (layouts: any[], value: string) => 
    layouts.find(l => l.value === value)?.name || value;

export const RemoveButton = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
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

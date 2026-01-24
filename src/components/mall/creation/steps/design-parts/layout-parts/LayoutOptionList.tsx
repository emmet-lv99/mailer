import { cn } from "@/lib/utils";
import { LayoutBlock } from "@/services/mall/types";
import { Check } from "lucide-react";

interface LayoutOption {
    name: string;
    value: string;
    desc: string;
}

interface LayoutOptionListProps {
    items: LayoutOption[];
    selectedVal?: string; // For radio-style selection (list/detail)
    activeMainCategory?: string; // For context
    existingBlocks?: LayoutBlock[]; // For counting in main builder
    onSelect: (value: string) => void;
    mode: 'add' | 'select'; // 'add' adds to stack, 'select' picks one option
}

export function LayoutOptionList({ items, selectedVal, existingBlocks, onSelect, mode }: LayoutOptionListProps) {
    return (
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 bg-white/50 rounded-xl p-1">
            {items.map((item) => {
                const count = mode === 'add' 
                    ? (existingBlocks || []).filter(b => b.type === item.value).length 
                    : 0;
                
                const isSelected = mode === 'select' && selectedVal === item.value;

                return (
                    <button
                        key={item.value}
                        onClick={() => onSelect(item.value)}
                        className={cn(
                            "group relative flex flex-col items-start p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md shrink-0",
                            (count > 0 || isSelected)
                                ? "border-indigo-600 bg-indigo-50/50"
                                : "border-gray-100 hover:border-indigo-200 bg-white"
                        )}
                    >
                        {mode === 'add' && count > 0 && (
                            <div className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {count}
                            </div>
                        )}
                        
                        <div className="flex justify-between w-full mb-1">
                            <span className={cn("text-xs font-bold", (count > 0 || isSelected) ? "text-indigo-700" : "text-gray-900")}>
                                {item.name}
                            </span>
                            {mode === 'select' && isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />}
                        </div>
                        
                        <span className="text-[10px] text-gray-500 leading-tight">
                            {item.desc}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

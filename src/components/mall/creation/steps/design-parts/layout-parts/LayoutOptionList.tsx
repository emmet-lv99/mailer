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
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 p-1">
            {items.map((item) => {
                const count = mode === 'add' 
                    ? (existingBlocks || []).filter(b => b.type === item.value).length 
                    : 0;
                
                const isSelected = mode === 'select' && selectedVal === item.value;
                const isActive = count > 0 || isSelected;

                return (
                    <button
                        key={item.value}
                        onClick={() => onSelect(item.value)}
                        className={cn(
                            "relative flex items-center justify-between w-full p-4 text-left rounded-2xl border-2 transition-all duration-200 shrink-0",
                            isActive
                                ? "border-indigo-500 bg-indigo-50/30 shadow-sm"
                                : "border-gray-100 hover:border-indigo-200 bg-white hover:bg-gray-50"
                        )}
                    >
                        <div className="flex flex-col gap-1 pr-8">
                            <span className={cn("text-sm font-bold", isActive ? "text-indigo-700" : "text-gray-900")}>
                                {item.name}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium leading-tight">
                                {item.desc}
                            </span>
                        </div>

                        {/* Right Actions: Count or Check */}
                        <div className="flex-shrink-0">
                            {mode === 'add' && count > 0 && (
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shadow-sm">
                                    {count}
                                </div>
                            )}
                            {mode === 'select' && isSelected && (
                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                                    <Check className="w-4 h-4" strokeWidth={3} />
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

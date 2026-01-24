"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock } from "lucide-react";

export type StepID = 'MAIN_PC' | 'DETAIL_PC' | 'LIST_PC' | 'MAIN_MOBILE' | 'DETAIL_MOBILE' | 'LIST_MOBILE';

interface DesignSidebarProps {
  currentStepId: StepID;
  completedSteps: StepID[];
  onStepSelect: (id: StepID) => void;
}

export function DesignSidebar({ currentStepId, completedSteps, onStepSelect }: DesignSidebarProps) {
  const steps: { id: StepID; label: string; phase: number }[] = [
    { id: 'MAIN_PC', label: '1. Main Page', phase: 1 },
    { id: 'DETAIL_PC', label: '2. Detail Page', phase: 1 },
    { id: 'LIST_PC', label: '3. List Page', phase: 1 },
    { id: 'MAIN_MOBILE', label: '4. Main Mobile', phase: 2 },
    { id: 'DETAIL_MOBILE', label: '5. Detail Mobile', phase: 2 },
    { id: 'LIST_MOBILE', label: '6. List Mobile', phase: 2 },
  ];

  const isStepLocked = (id: StepID) => {
    const index = steps.findIndex(s => s.id === id);
    if (index === 0) return false;
    const prevStep = steps[index - 1];
    return !completedSteps.includes(prevStep.id);
  };

  return (
    <div className="w-64 border-r bg-gray-50 flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-tight">시안 제작 단계</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* Phase 1: PC */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
            Phase 1: PC Web
          </h4>
          <div className="space-y-1">
            {steps.filter(s => s.phase === 1).map((step) => {
              const isActive = currentStepId === step.id;
              const isDone = completedSteps.includes(step.id);
              const isLocked = isStepLocked(step.id);

              return (
                <div 
                  key={step.id}
                  onClick={() => !isLocked && onStepSelect(step.id)}
                  className={`
                    flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer group
                    ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-100" : isLocked ? "text-gray-300 pointer-events-none" : "text-gray-600 hover:bg-white hover:shadow-sm"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className={`w-4 h-4 ${isActive ? "text-white" : "text-green-500"}`} />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${isActive ? "border-white" : "border-gray-300"}`}>
                        {step.label.split('.')[0]}
                      </div>
                    )}
                    <span className="text-xs font-medium">{step.label.split('. ')[1]}</span>
                  </div>
                  {isActive && <Badge variant="secondary" className="bg-blue-400/30 text-white text-[9px] border-none">Active</Badge>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase 2: Mobile */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
            Phase 2: Mobile App
          </h4>
          <div className="space-y-1">
            {steps.filter(s => s.phase === 2).map((step) => {
              const isActive = currentStepId === step.id;
              const isDone = completedSteps.includes(step.id);
              const isLocked = isStepLocked(step.id);

              return (
                <div 
                  key={step.id}
                  onClick={() => !isLocked && onStepSelect(step.id)}
                  className={`
                    flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer
                    ${isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : isLocked ? "text-gray-300 pointer-events-none" : "text-gray-600 hover:bg-white hover:shadow-sm"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className={`w-4 h-4 ${isActive ? "text-white" : "text-green-500"}`} />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${isActive ? "border-white" : "border-gray-300"}`}>
                        {step.label.split('.')[0]}
                      </div>
                    )}
                    <span className="text-xs font-medium">{step.label.split('. ')[1]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

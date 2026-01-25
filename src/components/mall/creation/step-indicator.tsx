import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "채널 분석" },
  { id: 2, label: "디자인 시스템" },
  { id: 3, label: "목업 스타일" },
  { id: 4, label: "레퍼런스" },
  { id: 5, label: "프롬프트 엔진" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-bold transition-all duration-200",
                isActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : isCompleted
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-300 text-gray-400"
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : step.id}
            </div>

            {/* Step Label */}
            <span
              className={cn(
                "ml-2 text-sm font-medium",
                isActive ? "text-blue-600" : isCompleted ? "text-green-500" : "text-gray-400"
              )}
            >
              {step.label}
            </span>

            {/* Connector Line (except for the last item) */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-12 h-[2px] mx-4 rounded-full",
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

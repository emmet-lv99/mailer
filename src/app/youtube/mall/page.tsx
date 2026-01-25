"use client";

import { StepIndicator } from "@/components/mall/creation/step-indicator";
import { ChannelAnalysisStep } from "@/components/mall/creation/steps/channel-analysis-step";
import { DesignSystemStep } from "@/components/mall/creation/steps/design-system-step"; // [New]
import { MockupStyleStep } from "@/components/mall/creation/steps/mockup-style-step";
import { PromptStep } from "@/components/mall/creation/steps/prompt-step";
import { ReferenceStep } from "@/components/mall/creation/steps/reference-step";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MallPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  
  // Default step 1, or load from saved state (TODO)
  const [currentStep, setCurrentStep] = useState(1);

  // Resume logic (Mock)
  useEffect(() => {
    if (projectId) {
      console.log("Resuming project:", projectId);
      // TODO: Fetch project status from DB and setStep
    }
  }, [projectId]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <StepIndicator currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 1 && <ChannelAnalysisStep onNext={nextStep} />}
        {currentStep === 2 && <DesignSystemStep onNext={nextStep} onBack={prevStep} />}
        {currentStep === 3 && <MockupStyleStep onNext={nextStep} onBack={prevStep} />}
        {currentStep === 4 && <ReferenceStep onNext={nextStep} onBack={prevStep} />}
        {currentStep === 5 && <PromptStep onNext={nextStep} onBack={prevStep} />}
      </div>
    </div>
  );
}

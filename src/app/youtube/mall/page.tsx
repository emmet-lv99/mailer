"use client";

import { StepIndicator } from "@/components/mall/creation/step-indicator";
import { ChannelAnalysisStep } from "@/components/mall/creation/steps/channel-analysis-step";
import { DesignStep } from "@/components/mall/creation/steps/design-step";
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

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <StepIndicator currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 1 && <ChannelAnalysisStep onNext={nextStep} />}
        {currentStep === 2 && <ReferenceStep onNext={nextStep} onBack={prevStep} />}
        {currentStep === 3 && <DesignStep onBack={prevStep} />}
      </div>
    </div>
  );
}

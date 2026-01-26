import { StepIndicator } from "@/components/mall/creation/step-indicator";
import { ChannelAnalysisStep } from "@/components/mall/creation/steps/channel-analysis-step";
import { LayoutDesignStep } from "@/components/mall/creation/steps/layout-design-step";
import { LayoutStep } from "@/components/mall/creation/steps/layout-step";
import { PromptStep } from "@/components/mall/creation/steps/prompt-step";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function MallContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  
  const [currentStep, setCurrentStep] = useState(1);

  // Resume logic (Mock)
  useEffect(() => {
    if (projectId) {
      console.log("Resuming project:", projectId);
      // TODO: Fetch project status from DB and setStep
    }
  }, [projectId]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <StepIndicator currentStep={currentStep} />

      <div className="mt-8">
        {currentStep === 1 && <ChannelAnalysisStep onNext={nextStep} />}
        {currentStep === 2 && <LayoutStep onNext={nextStep} onBack={prevStep} />}
        {currentStep === 3 && <LayoutDesignStep onNext={nextStep} onBack={prevStep} />}
        {currentStep === 4 && <PromptStep onNext={nextStep} onBack={prevStep} />}
      </div>
    </div>
  );
}

export default function MallPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 px-4">Loading...</div>}>
      <MallContent />
    </Suspense>
  );
}

import { toast } from "sonner";
import { create } from 'zustand';
import { saveProject } from './project';
import { DesignSpec, MallProjectAnalysis } from './types';

interface MallState {
  projectId: string | null;
  currentStep: number;
  
  // Step 1: Channel Analysis
  channelUrl: string;
  competitors: string[];
  analysisResult: MallProjectAnalysis | null;
  
  // Step 2: Reference Analysis
  referenceImages: string[];
  referenceAnalysis: DesignSpec | null;

  // Step 3: Design Generation [NEW]
  designVariants: Record<string, string[]>; // { 'MAIN_PC': [...], 'DETAIL_PC': [...] }
  selectedDesigns: Record<string, string>; // { 'MAIN_PC': 'base64...', ... }
  generationStatus: 'idle' | 'generating' | 'completed';
  refinedPrompts: Record<string, string>; // { 'MAIN_PC': 'Refined...', ... }

  // Actions
  setProjectId: (id: string | null) => void;
  setStep: (step: number) => void;
  setChannelData: (url: string, competitors: string[]) => void;
  setAnalysisResult: (result: MallProjectAnalysis) => void;
  setReferenceImages: (images: string[]) => void;
  setReferenceAnalysis: (result: DesignSpec) => void;
  updateAnalysisResult: (data: Partial<MallProjectAnalysis>) => void; // [NEW] Edit mode support
  updateReferenceAnalysis: (data: Partial<DesignSpec>) => void;
  setDesignVariants: (step: string, images: string[]) => void;
  selectDesign: (step: string, image: string) => void;
  setGenerationStatus: (status: 'idle' | 'generating' | 'completed') => void;
  setRefinedPrompt: (step: string, prompt: string) => void;
  save: () => Promise<void>; 
  loadProject: (project: any) => void;
  resetAll: () => void;
}

export const useMallStore = create<MallState>((set, get) => ({
  projectId: null,
  currentStep: 1,
  
  channelUrl: "",
  competitors: [],
  analysisResult: null,

  // Step 2
  referenceImages: [],
  referenceAnalysis: null,

  // Step 3
  designVariants: {},
  selectedDesigns: {},
  generationStatus: 'idle',
  refinedPrompts: {},

  setProjectId: (id) => set({ projectId: id }),
  setStep: (step) => set({ currentStep: step }),
  
  setChannelData: (url, competitors) => set({ channelUrl: url, competitors }),
  
  // When Channel Analysis updates, we MUST clear downstream steps
  setAnalysisResult: (result) => set({ 
    analysisResult: result,
    referenceImages: [], 
    referenceAnalysis: null 
  }),

  setReferenceImages: (images) => set({ referenceImages: images }),
  setReferenceAnalysis: (result) => set({ referenceAnalysis: result }),

  updateAnalysisResult: (data) => set((state) => ({
    analysisResult: state.analysisResult 
      ? { ...state.analysisResult, ...data } 
      : null
  })),

  updateReferenceAnalysis: (data) => set((state) => ({
    referenceAnalysis: state.referenceAnalysis 
      ? { ...state.referenceAnalysis, ...data } 
      : null
  })),

  setDesignVariants: (step, images) => set((state) => ({
    designVariants: { ...state.designVariants, [step]: images }
  })),

  selectDesign: (step, image) => set((state) => ({
    selectedDesigns: { ...state.selectedDesigns, [step]: image }
  })),

  setGenerationStatus: (status) => set({ generationStatus: status }),

  setRefinedPrompt: (step, prompt) => set((state) => ({
    refinedPrompts: { ...state.refinedPrompts, [step]: prompt }
  })),

  // [NEW] Load existing project data
  loadProject: (project: any) => {
    set({
      projectId: project.id,
      channelUrl: project.youtube_channel_url,
      competitors: project.competitor_channels || [],
      analysisResult: {
        channelName: project.channel_name,
        marketing: project.marketing_analysis,
        design: project.design_analysis,
      },
      referenceAnalysis: project.reference_analysis,
      // Note: referenceImages are local-only previews
      referenceImages: [], 
    });
  },

  save: async () => {
    const { projectId, channelUrl, competitors, analysisResult, referenceAnalysis } = get();
    
    // Validation
    if (!channelUrl) {
      toast.error("저장할 데이터가 없습니다.");
      return;
    }

    try {
      toast.info("프로젝트 저장 중...");
      const savedData = await saveProject({
        id: projectId || undefined,
        youtubeChannelUrl: channelUrl,
        competitorUrls: competitors,
        channelName: analysisResult?.channelName,
        marketingAnalysis: analysisResult?.marketing,
        designAnalysis: analysisResult?.design,
        referenceAnalysis: referenceAnalysis || undefined,
      });

      if (savedData?.id) {
        set({ projectId: savedData.id });
        toast.success("프로젝트가 저장되었습니다.");
      }
    } catch (error) {
      console.error("Save Failed:", error);
      toast.error("저장에 실패했습니다.");
    }
  },
  
  resetAll: () => set({
    projectId: null,
    currentStep: 1,
    channelUrl: "",
    competitors: [],
    analysisResult: null,
    referenceImages: [],
    referenceAnalysis: null,
    refinedPrompts: {},
    designVariants: {},
    selectedDesigns: {},
  }),
}));

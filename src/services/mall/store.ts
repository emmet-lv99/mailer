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
  referenceImages: string[]; // [NEW] Base64 previews to restore UI
  referenceAnalysis: DesignSpec | null;

  // Actions
  setProjectId: (id: string | null) => void;
  setStep: (step: number) => void;
  setChannelData: (url: string, competitors: string[]) => void;
  setAnalysisResult: (result: MallProjectAnalysis) => void;
  setReferenceImages: (images: string[]) => void;
  setReferenceAnalysis: (result: DesignSpec) => void;
  save: () => Promise<void>; // [NEW] Save Project
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
  }),
}));

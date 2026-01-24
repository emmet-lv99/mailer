export interface MarketingSpec {
  target: {
    ageRange: string;
    gender: string;
    interests: string[];
  };
  persona: {
    name: string;
    oneLiner: string;
    needs: string[];
    painPoints: string[];
  };
  product: {
    categories: string[];
    priceRange: string;
    keyFeatures: string[];
  };
  strategy: {
    usp: string;
    mood: string;
    swot: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    brandArchetype: {
      primary: string;
      secondary: string;
      mixReason: string;
    };
    storyBrand: {
      hero: string;
      problem: string;
      guide: string;
      plan: string;
      success: string;
    };
    brandKeywords: string[];
    competitors: {
      name: string;
      reason: string;
    }[];
  };
  // structure removed from UI
  structure?: {
    gnb: string[];
    mainLayout: string[];
  };
}

export interface DesignSpec {
  concept: {
    keywords?: string[]; // keywords removed from UI
    description: string;
  };
  foundation: {
    colors: {
      primary: string;
      secondary: string;
      background: { main: string; sub: string };
      text: { title: string; body: string; disabled: string };
    };
    typography: {
      fontFamily: string;
      scale: string;
      weightRule: string;
    };
    shapeLayout: {
      borderRadius: string;
      spacing: string;
      grid: string;
    };
  };
  // components removed from UI
  components?: {
    buttons: string;
    cards: string;
    inputForm: string;
    gnbFooter: string;
  };
  mood: {
    imagery: string;
    graphicMotifs: string;
    iconography: string;
  };
}

export interface MallProjectAnalysis {
  _reasoning?: string;
  channelName: string;
  marketing: MarketingSpec;
  design: DesignSpec;
}

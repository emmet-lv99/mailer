export interface LayoutBlockSpec {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  description: string;
  descriptionKo: string;
  visualStructure?: string;
  specifications?: any;
  promptTemplate: string;
  useCases: string[];
}

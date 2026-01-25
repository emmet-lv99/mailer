import { DETAIL_BLOCKS } from "./blocks-detail";
import { MAIN_BLOCKS, SUB_BANNER_BLOCKS } from "./blocks-main";
import { FOOTER_BLOCKS, HEADER_BLOCKS, PRODUCT_LIST_BLOCKS, PRODUCT_LIST_KEYWORD_ADAPTATIONS, SECTION_HEADER_BLOCKS, TOP_BANNER_BLOCKS } from "./blocks-shared";
import { VIDEO_BLOCKS, VIDEO_KEYWORD_ADAPTATIONS } from "./blocks-video";
import { VISUAL_FIDELITY_RULES } from "./constants";

export function generateMainBlockPrompt(
  blockType: string,
  designKeywords: string[],
  archetypeGuidance?: string
): string {
  const block = MAIN_BLOCKS[blockType] || DETAIL_BLOCKS[blockType] || HEADER_BLOCKS[blockType] || TOP_BANNER_BLOCKS[blockType] || SUB_BANNER_BLOCKS[blockType] || FOOTER_BLOCKS[blockType] || SECTION_HEADER_BLOCKS[blockType];
  if (!block) return '';
  
  const adaptation = getVideoKeywordAdaptation(designKeywords);
  let prompt = block.promptTemplate;

  prompt += `\n\n━━━ TECHNICAL SPECIFICATIONS (BLOCK: ${block.id}) ━━━`;
  if (block.visualStructure) prompt += `\nVisual Layout:\n${block.visualStructure}`;
  if (block.specifications) prompt += `\nRaw Specs: ${JSON.stringify(block.specifications)}`;
  
  prompt += `\n\n━━━ DESIGN ADAPTATIONS (Keywords: ${designKeywords.join(', ')}) ━━━`;
  prompt += `\n- Corner Geometry: ${adaptation.borderRadius} corner radius`;
  if (archetypeGuidance) prompt += `\n- Archetype Guidance: ${archetypeGuidance}`;
  prompt += `\n${VISUAL_FIDELITY_RULES}`;
  
  return prompt;
}

export function generateVideoPrompt(
  blockType: string,
  designKeywords: string[],
  archetypeGuidance?: string
): string {
  const block = VIDEO_BLOCKS[blockType];
  if (!block) return '';
  
  const adaptation = getVideoKeywordAdaptation(designKeywords);
  let prompt = block.promptTemplate;

  prompt += `\n\n━━━ TECHNICAL SPECIFICATIONS (BLOCK: ${block.id}) ━━━`;
  if (block.visualStructure) prompt += `\nVisual Layout:\n${block.visualStructure}`;
  if (block.specifications) prompt += `\nRaw Specs: ${JSON.stringify(block.specifications)}`;
  
  prompt += `\n\n━━━ DESIGN ADAPTATIONS (Keywords: ${designKeywords.join(', ')}) ━━━`;
  prompt += `\n- Corner Geometry: ${adaptation.borderRadius} corner radius`;
  prompt += `\n- Interaction: ${adaptation.playButtonStyle} Play Button with subtle glow`;
  if (archetypeGuidance) prompt += `\n- Archetype Guidance: ${archetypeGuidance}`;
  prompt += `\n${VISUAL_FIDELITY_RULES}`;
  
  return prompt;
}

function getVideoKeywordAdaptation(keywords: string[]) {
  const upperKeywords = keywords.map(k => k.toUpperCase());
  for (const keyword of upperKeywords) {
    if (VIDEO_KEYWORD_ADAPTATIONS[keyword]) {
      return VIDEO_KEYWORD_ADAPTATIONS[keyword];
    }
  }
  return VIDEO_KEYWORD_ADAPTATIONS.MODERN;
}

export function generateProductListPrompt(
  gridType: 'grid-5' | 'grid-4' | 'grid-3' | 'grid-2',
  designKeywords: string[],
  archetypeGuidance?: string
): string {
  const block = PRODUCT_LIST_BLOCKS[gridType];
  const adaptation = getProductListKeywordAdaptation(designKeywords);
  
  let prompt = block.promptTemplate;

  prompt += `\n\n━━━ TECHNICAL SPECIFICATIONS (BLOCK: ${block.id}) ━━━`;
  if (block.visualStructure) prompt += `\nVisual Layout:\n${block.visualStructure}`;
  if (block.specifications) prompt += `\nRaw Specs: ${JSON.stringify(block.specifications)}`;
  
  prompt += `\n\n━━━ DESIGN ADAPTATIONS (Keywords: ${designKeywords.join(', ')}) ━━━`;
  prompt += `\n- Surface Style: ${adaptation.borderRadius} radius, ${adaptation.cardBorder} border`;
  prompt += `\n- Atmosphere: Shadow intensity ${adaptation.shadow}, Hover elevation ${adaptation.hoverShadow}`;
  if (adaptation.spacing) prompt += `\n- Verticality: ${adaptation.spacing}`;
  if (adaptation.hoverTransform) prompt += `\n- Dynamics: ${adaptation.hoverTransform}`;
  if (archetypeGuidance) prompt += `\n- Archetype Guidance: ${archetypeGuidance}`;
  prompt += `\n${VISUAL_FIDELITY_RULES}`;
  
  return prompt;
}

function getProductListKeywordAdaptation(keywords: string[]) {
  const upperKeywords = keywords.map(k => k.toUpperCase());
  for (const keyword of upperKeywords) {
    if (PRODUCT_LIST_KEYWORD_ADAPTATIONS[keyword]) {
      return PRODUCT_LIST_KEYWORD_ADAPTATIONS[keyword];
    }
  }
  return PRODUCT_LIST_KEYWORD_ADAPTATIONS.MODERN;
}

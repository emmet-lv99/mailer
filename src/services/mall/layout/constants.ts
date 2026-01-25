export const VISUAL_FIDELITY_RULES = `
━━━ VISUAL FIDELITY & MATERIAL QUALITY ━━━
- LIGHTING: Multi-point studio lighting, soft diffused shadows, no harsh glare. High dynamic range (HDR).
- MATERIALS: Anti-aliased UI edges, glassmorphism hints where appropriate, premium paper-texture backgrounds or pure #FFFFFF.
- FIDELITY: 8K resolution, high-fidelity UI/UX rendering, ray-traced reflections on glass/metallic products.
- KOREAN COMMERCE STANDARD: High item density, clean vertical hierarchy, focused readability.
`;

export const FEW_SHOT_EXAMPLES = [
  {
    type: 'Luxury Boutique (High-Prose Narrative)',
    prompt: `A hyper-realistic direct 2D screenshot of a world-class luxury boutique website for PC desktop. The aesthetic is defined by an uncompromising "Minimalist Prestige" DNA, utilizing extensive white space and a sophisticated palette of deep charcoal (#111111) and muted ivory. The typography exudes authority, featuring "Bodoni" serif headings with generous letter-spacing. At the summit, a slender 80px header anchors a perfectly centered, fine-lined brand insignia. The centerpiece is a cinematic "Carousel Center" hero banner; a 1280px wide masterwork showcasing a high-end leather tote under multi-point gallery lighting, with side-peek fragments of the next visual narrative. Below, a crystalline 3-column product grid unfolds (380x570px cards), where each item is framed by a delicate 0.5px silver divider. Product photography is breathtakingly sharp, rendered on pure #FFFFFF backgrounds with ray-traced reflections on hardware. The interface is polished with 8K clarity, anti-aliased UI edges, and HDR brilliance to ensure a premium interactive experience.`
  },
  {
    type: 'Modern Tech & Gaming (Technical Cinema)',
    prompt: `A high-octane, tech-forward 2D homepage capture for a flagship electronics store, rendered in 16:9 PC widescreen. The visual DNA is "Aero-Dynamic Brutalist," utilizing sharp 0px corners and a dark-mode core (#0F0F0F) punctuated by vibrant cyan accent gradients. Bold "Inter" sans-serif headers command attention at 64px. The layout transitions from a stunning full-width cinematic video showcase—featuring explosive product macro shots—into a high-density "Grid 5-Column" product matrix. Each 220x340px product card is a high-fidelity artifact, featuring a subtle 1px neon-glow border and a deep elevation shadow. Interactive elements like "Pill-style" CTA buttons pulse with a soft HDR bloom. The entire UI is rendered with 8K precision, capturing the micro-textures of metallic finishes and the soft diffusion of multi-point studio lighting across the interface, reminiscent of a professional high-end gaming console's dashboard.`
  }
];


export const VIDEO_COMMON = {
  playButton: {
    background: 'rgba(255,255,255,0.95)',
    shadow: '0 4px 12px rgba(0,0,0,0.3)',
    color: '#000000'
  },
  aspectRatios: { vertical: '9:16', horizontal: '16:9', cinematic: '21:9' }
};

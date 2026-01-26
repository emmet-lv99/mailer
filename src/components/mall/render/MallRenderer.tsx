import { DesignSpec, LayoutBlock } from "@/services/mall/types";
import { LiveBannerBlock } from "./blocks/LiveBannerBlock";
import { LiveHeroBlock } from "./blocks/LiveHeroBlock";
import { LiveProductBlock } from "./blocks/LiveProductBlock";

interface MallRendererProps {
  design: DesignSpec;
}

export function MallRenderer({ design }: MallRendererProps) {
  const { shapeLayout } = design.foundation;
  const mockupStyles = design.concept.mockupStyles;

  const renderBlock = (block: LayoutBlock, index: number) => {
    switch (block.category) {
      case 'main':
        return <LiveHeroBlock key={block.id + index} block={block} mockupStyle={mockupStyles?.hero} />;
      case 'sub':
      case 'top-banner':
        return <LiveBannerBlock key={block.id + index} block={block} mockupStyle={mockupStyles?.thumbnail} />;
      case 'product-list':
        return <LiveProductBlock key={block.id + index} block={block} mockupStyle={mockupStyles?.product} />;
      case 'header':
      case 'footer':
        return null;
      default:
        return (
            <div key={block.id + index} className="py-12 text-center text-red-400 bg-red-50">
                Unknown Category: {block.category}
            </div>
        );
    }
  };

  /* Extract style generation logic here or move to helper */
  const { colors, typography } = design.foundation;
  const styleVariables = {
    // Colors
    "--brand-primary": colors.primary,
    "--brand-secondary": colors.secondary,
    "--bg-main": colors.background.main,
    "--bg-sub": colors.background.sub,
    "--text-title": colors.text.title,
    "--text-body": colors.text.body,
    
    // Typography
    "--font-display": typography.displayFontFamily,
    "--font-body": typography.bodyFontFamily,
    "--font-weight-rule": typography.weightRule,
    
    // Shape
    "--border-radius": design.foundation.shapeLayout.borderRadius || "0px",
  } as React.CSSProperties;

  return (
    <div 
      className="mall-renderer min-h-screen w-full relative bg-[var(--bg-main)] text-[var(--text-body)] transition-colors duration-300"
      style={styleVariables}
    >
      <style jsx global>{`
        .mall-renderer {
          font-family: var(--font-body), sans-serif;
        }
        .mall-renderer h1, .mall-renderer h2, .mall-renderer h3 {
          font-family: var(--font-display), sans-serif;
        }
      `}</style>
      
      <main className="w-full space-y-20 pb-20">
        {shapeLayout?.mainBlocks?.length > 0 ? (
           shapeLayout.mainBlocks.map((block: LayoutBlock, index: number) => renderBlock(block, index))
        ) : (
           <div className="py-20 text-center text-gray-400">
             <p>No layout blocks defined.</p>
           </div>
        )}
      </main>
    </div>
  );
}

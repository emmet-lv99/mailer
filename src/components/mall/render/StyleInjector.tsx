import { DesignSpec } from "@/services/mall/types";

interface StyleInjectorProps {
  foundation: DesignSpec["foundation"];
}

export function StyleInjector({ foundation }: StyleInjectorProps) {
  const { colors, typography } = foundation;

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
    "--border-radius": foundation.shapeLayout.borderRadius || "0px",
  } as React.CSSProperties;

  return (
    <div style={styleVariables} className="contents">
      <style jsx global>{`
        .mall-renderer {
          font-family: var(--font-body), sans-serif;
          color: var(--text-body);
          background-color: var(--bg-main);
        }
        .mall-renderer h1, .mall-renderer h2, .mall-renderer h3 {
          font-family: var(--font-display), sans-serif;
          color: var(--text-title);
        }
      `}</style>
    </div>
  );
}

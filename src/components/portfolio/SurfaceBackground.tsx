import type { BackgroundMode, BackgroundPattern } from "@/lib/background-utils";
import { getPatternStyle } from "@/lib/background-utils";

export function SurfaceBackground({
  mode,
  baseColor,
  gradientFrom,
  gradientTo,
  backgroundImage,
  pattern = "dots",
  patternColor,
  overlayOpacity = 0.55,
  showGradientOverlay = true,
}: {
  mode: BackgroundMode;
  baseColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage?: string;
  pattern?: BackgroundPattern;
  patternColor?: string;
  overlayOpacity?: number;
  showGradientOverlay?: boolean;
}) {
  const patternTint = patternColor || gradientFrom;
  const effectiveMode = mode === "inherit" ? "solid" : mode;
  const solidColor = baseColor;

  return (
    <>
      {effectiveMode === "image" && backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            aria-hidden
          />
          <div className="absolute inset-0" style={{ backgroundColor: solidColor, opacity: overlayOpacity }} aria-hidden />
        </>
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: solidColor }} aria-hidden />
      )}

      {effectiveMode === "pattern" && (
        <div className="absolute inset-0" style={getPatternStyle(pattern, patternTint)} aria-hidden />
      )}

      {(effectiveMode === "gradient" || (showGradientOverlay && effectiveMode === "image")) && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}${effectiveMode === "image" ? "cc" : "22"} 0%, transparent 52%, ${gradientTo}${effectiveMode === "image" ? "99" : "10"} 100%)`,
          }}
          aria-hidden
        />
      )}
    </>
  );
}

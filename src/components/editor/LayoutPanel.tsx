"use client";

import type { PortfolioTheme } from "@/lib/portfolio-theme";
import type { BackgroundMode, BackgroundPattern } from "@/lib/background-utils";
import { buildMapEmbedUrl } from "@/lib/background-utils";
import {
  PanelSection,
  LayoutGroup,
  ColorInput,
  OptionGroup,
  ToggleList,
  FieldHint,
} from "./EditorShared";
import { normalizeLiveChatUrl } from "@/lib/normalize-url";

function BackgroundModeControls({
  mode,
  onModeChange,
  baseColor,
  onBaseColorChange,
  gradientFrom,
  gradientTo,
  onGradientFrom,
  onGradientTo,
  pattern,
  onPatternChange,
  overlay,
  onOverlayChange,
  showGradientToggle,
  showGradient,
  onShowGradientChange,
  backgroundImage,
  uploading,
  onUpload,
  onClearImage,
  imageLabel = "Upload image",
}: {
  mode: BackgroundMode;
  onModeChange: (m: BackgroundMode) => void;
  baseColor: string;
  onBaseColorChange: (v: string) => void;
  gradientFrom: string;
  gradientTo: string;
  onGradientFrom: (v: string) => void;
  onGradientTo: (v: string) => void;
  pattern: BackgroundPattern;
  onPatternChange: (p: BackgroundPattern) => void;
  overlay: number;
  onOverlayChange: (v: number) => void;
  showGradientToggle?: boolean;
  showGradient?: boolean;
  onShowGradientChange?: (v: boolean) => void;
  backgroundImage?: string;
  uploading?: boolean;
  onUpload?: (file: File) => void;
  onClearImage?: () => void;
  imageLabel?: string;
}) {
  return (
    <>
      <PanelSection title="Background type">
        <OptionGroup
          value={mode}
          options={[
            { value: "solid", label: "Solid" },
            { value: "gradient", label: "Gradient" },
            { value: "image", label: "Image" },
            { value: "pattern", label: "Pattern" },
          ]}
          onChange={(v) => onModeChange(v as BackgroundMode)}
        />
      </PanelSection>

      {(mode === "solid" || mode === "pattern" || mode === "image") && (
        <PanelSection title="Base color">
          <ColorInput label="Background color" value={baseColor} onChange={onBaseColorChange} />
        </PanelSection>
      )}

      {mode === "gradient" && (
        <PanelSection title="Gradient">
          <div className="space-y-3">
            <ColorInput label="From" value={gradientFrom} onChange={onGradientFrom} />
            <ColorInput label="To" value={gradientTo} onChange={onGradientTo} />
          </div>
        </PanelSection>
      )}

      {mode === "pattern" && (
        <PanelSection title="Pattern style">
          <OptionGroup
            value={pattern}
            options={[
              { value: "dots", label: "Dots" },
              { value: "grid", label: "Grid" },
              { value: "diagonal", label: "Lines" },
            ]}
            onChange={(v) => onPatternChange(v as BackgroundPattern)}
          />
        </PanelSection>
      )}

      {mode === "image" && (
        <PanelSection title="Background image">
          {backgroundImage && (
            <div className="mb-3 rounded-lg overflow-hidden border" style={{ borderColor: "var(--app-border)" }}>
              <img src={backgroundImage} alt="" className="w-full h-24 object-cover" />
            </div>
          )}
          <div className="flex gap-2">
            <label className="btn-secondary text-xs cursor-pointer flex-1 text-center">
              {uploading ? "Uploading..." : imageLabel}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && onUpload) onUpload(file);
                }}
              />
            </label>
            {backgroundImage && onClearImage && (
              <button type="button" onClick={onClearImage} className="btn-secondary text-xs">
                Remove
              </button>
            )}
          </div>
          <PanelSection title="Image overlay">
            <label className="text-xs block mb-1" style={{ color: "var(--app-text-muted)" }}>
              Overlay ({Math.round(overlay * 100)}%)
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={overlay}
              onChange={(e) => onOverlayChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </PanelSection>
        </PanelSection>
      )}

      {showGradientToggle && onShowGradientChange && (
        <label className="flex items-center gap-2 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={showGradient !== false}
            onChange={(e) => onShowGradientChange(e.target.checked)}
            className="rounded accent-violet-600"
          />
          <span className="text-sm" style={{ color: "var(--app-text)" }}>Gradient overlay</span>
        </label>
      )}
    </>
  );
}

export default function LayoutPanel({
  theme,
  updateTheme,
  profileLocation,
  uploadingHero,
  onHeroUpload,
  onClearHeroImage,
  uploadingFooter,
  onFooterUpload,
  onClearFooterImage,
}: {
  theme: PortfolioTheme;
  updateTheme: (p: Partial<PortfolioTheme>) => void;
  profileLocation?: string;
  uploadingHero?: boolean;
  onHeroUpload?: (file: File) => void;
  onClearHeroImage?: () => void;
  uploadingFooter?: boolean;
  onFooterUpload?: (file: File) => void;
  onClearFooterImage?: () => void;
}) {
  const hero = theme.hero ?? {};
  const footer = theme.footer ?? {};
  const heroBgMode = hero.backgroundMode || (hero.backgroundImage ? "image" : "gradient");
  const footerBgMode = footer.backgroundMode || (footer.backgroundImage ? "image" : "solid");

  return (
    <div className="space-y-2">
      <LayoutGroup title="Page layout" subtitle="Width and spacing for the whole portfolio">
        {[
          { title: "Content width", key: "contentWidth", options: ["narrow", "medium", "wide"] },
          { title: "Section spacing", key: "spacing", options: ["compact", "normal", "relaxed"] },
          { title: "Corner radius", key: "borderRadius", options: ["none", "md", "lg", "full"] },
        ].map(({ title, key, options }) => (
          <PanelSection key={key} title={title}>
            <OptionGroup
              value={theme.layout[key as keyof typeof theme.layout] as string}
              options={options.map((o) => ({ value: o, label: o.charAt(0).toUpperCase() + o.slice(1) }))}
              onChange={(v) => updateTheme({ layout: { ...theme.layout, [key]: v } })}
            />
          </PanelSection>
        ))}
        <PanelSection title="Heading font">
          <OptionGroup
            value={theme.typography.headingFont}
            options={[
              { value: "serif", label: "Serif" },
              { value: "sans", label: "Sans" },
              { value: "mono", label: "Mono" },
            ]}
            onChange={(v) =>
              updateTheme({ typography: { ...theme.typography, headingFont: v as PortfolioTheme["typography"]["headingFont"] } })
            }
          />
        </PanelSection>
      </LayoutGroup>

      <LayoutGroup title="Hero" subtitle="Top banner — photo, title, and background">
        <BackgroundModeControls
          mode={heroBgMode}
          onModeChange={(m) => updateTheme({ hero: { ...hero, backgroundMode: m } })}
          baseColor={hero.backgroundColor || theme.colors.background}
          onBaseColorChange={(v) => updateTheme({ hero: { ...hero, backgroundColor: v } })}
          gradientFrom={hero.gradientFrom || theme.colors.primary}
          gradientTo={hero.gradientTo || theme.colors.accent}
          onGradientFrom={(v) => updateTheme({ hero: { ...hero, gradientFrom: v } })}
          onGradientTo={(v) => updateTheme({ hero: { ...hero, gradientTo: v } })}
          pattern={hero.backgroundPattern || "dots"}
          onPatternChange={(p) => updateTheme({ hero: { ...hero, backgroundPattern: p } })}
          overlay={hero.overlayOpacity ?? 0.55}
          onOverlayChange={(v) => updateTheme({ hero: { ...hero, overlayOpacity: v } })}
          backgroundImage={hero.backgroundImage}
          uploading={uploadingHero}
          onUpload={onHeroUpload}
          onClearImage={onClearHeroImage}
          imageLabel="Upload hero image"
        />

        <PanelSection title="Hero layout">
          <div className="space-y-3">
            <div>
              <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Style</p>
              <OptionGroup
                value={theme.layout.heroStyle}
                options={[
                  { value: "centered", label: "Centered" },
                  { value: "split", label: "Split" },
                  { value: "minimal", label: "Minimal" },
                  { value: "animated", label: "Animated" },
                  { value: "video", label: "Video" },
                  { value: "card3d", label: "Card 3D" },
                ]}
                onChange={(v) => updateTheme({ layout: { ...theme.layout, heroStyle: v as PortfolioTheme["layout"]["heroStyle"] } })}
              />
            </div>
            <div>
              <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Alignment</p>
              <OptionGroup
                value={theme.layout.heroAlignment}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Center" },
                  { value: "right", label: "Right" },
                ]}
                onChange={(v) => updateTheme({ layout: { ...theme.layout, heroAlignment: v as PortfolioTheme["layout"]["heroAlignment"] } })}
              />
            </div>
          </div>
        </PanelSection>

        <PanelSection title="Hero video URL">
          <input
            type="url"
            value={hero.videoBackgroundUrl || ""}
            onChange={(e) => updateTheme({ hero: { ...hero, videoBackgroundUrl: e.target.value } })}
            placeholder="https://...mp4 (Video hero style only)"
            className="input-field text-sm"
          />
        </PanelSection>

        <PanelSection title="Hero effects">
          <ToggleList
            items={[
              { key: "particles", label: "Particles" },
              { key: "glassEffect", label: "Glass effect" },
              { key: "aurora", label: "Aurora gradient" },
              { key: "waves", label: "Animated waves" },
            ]}
            values={{
              particles: !!hero.particles,
              glassEffect: !!hero.glassEffect,
              aurora: !!hero.aurora,
              waves: !!hero.waves,
            }}
            onChange={(key, v) => updateTheme({ hero: { ...hero, [key]: v } })}
          />
        </PanelSection>
      </LayoutGroup>

      <LayoutGroup title="Footer" subtitle="Bottom bar — style, map, and background">
        <PanelSection title="Footer layout style">
          <OptionGroup
            value={theme.features.footerStyle || "default"}
            options={[
              { value: "default", label: "Default" },
              { value: "minimal", label: "Minimal" },
              { value: "rich", label: "Rich" },
              { value: "cta", label: "CTA" },
              { value: "map", label: "Map" },
            ]}
            onChange={(v) =>
              updateTheme({ features: { ...theme.features, footerStyle: v as PortfolioTheme["features"]["footerStyle"] } })
            }
          />
          <FieldHint>Choose Map to show a location pin and embedded map.</FieldHint>
        </PanelSection>

        {(theme.features.footerStyle === "map" || footer.mapLocation) && (
          <PanelSection title="Map location">
            <input
              type="text"
              value={footer.mapLocation ?? ""}
              onChange={(e) => updateTheme({ footer: { ...footer, mapLocation: e.target.value } })}
              onBlur={(e) => {
                const loc = e.target.value.trim();
                if (loc && !footer.mapEmbedUrl) {
                  updateTheme({
                    footer: {
                      ...footer,
                      mapLocation: loc,
                      mapEmbedUrl: buildMapEmbedUrl(loc, footer.mapZoom ?? 14),
                    },
                  });
                }
              }}
              placeholder="e.g. Nablus, Palestine"
              className="input-field text-sm"
            />
            <FieldHint>
              {profileLocation
                ? `Profile location: "${profileLocation}" — used if this field is empty.`
                : "Enter a city or address. Map generates automatically."}
            </FieldHint>
            <div className="mt-3">
              <p className="text-xs mb-1.5" style={{ color: "var(--app-text-muted)" }}>Map zoom</p>
              <OptionGroup
                value={String(footer.mapZoom ?? 14)}
                options={[
                  { value: "12", label: "City" },
                  { value: "14", label: "Area" },
                  { value: "16", label: "Street" },
                ]}
                onChange={(v) =>
                  updateTheme({
                    footer: {
                      ...footer,
                      mapZoom: parseInt(v, 10),
                      mapEmbedUrl: footer.mapLocation
                        ? buildMapEmbedUrl(footer.mapLocation, parseInt(v, 10))
                        : footer.mapEmbedUrl,
                    },
                  })
                }
              />
            </div>
            <details className="mt-3">
              <summary className="text-xs cursor-pointer" style={{ color: "var(--app-text-muted)" }}>
                Advanced: custom embed URL
              </summary>
              <input
                type="text"
                value={footer.mapEmbedUrl ?? ""}
                onChange={(e) => updateTheme({ footer: { ...footer, mapEmbedUrl: e.target.value } })}
                placeholder="https://www.google.com/maps/embed?..."
                className="input-field text-xs mt-2"
              />
            </details>
          </PanelSection>
        )}

        <BackgroundModeControls
          mode={footerBgMode}
          onModeChange={(m) => updateTheme({ footer: { ...footer, backgroundMode: m } })}
          baseColor={footer.backgroundColor || theme.colors.surface}
          onBaseColorChange={(v) => updateTheme({ footer: { ...footer, backgroundColor: v } })}
          gradientFrom={footer.gradientFrom || theme.colors.primary}
          gradientTo={footer.gradientTo || theme.colors.accent}
          onGradientFrom={(v) => updateTheme({ footer: { ...footer, gradientFrom: v } })}
          onGradientTo={(v) => updateTheme({ footer: { ...footer, gradientTo: v } })}
          pattern={footer.backgroundPattern || "dots"}
          onPatternChange={(p) => updateTheme({ footer: { ...footer, backgroundPattern: p } })}
          overlay={footer.overlayOpacity ?? 0.94}
          onOverlayChange={(v) => updateTheme({ footer: { ...footer, overlayOpacity: v } })}
          showGradientToggle
          showGradient={footer.showGradient}
          onShowGradientChange={(v) => updateTheme({ footer: { ...footer, showGradient: v } })}
          backgroundImage={footer.backgroundImage}
          uploading={uploadingFooter}
          onUpload={onFooterUpload}
          onClearImage={onClearFooterImage}
          imageLabel="Upload footer image"
        />

        <PanelSection title="Footer text colors">
          <div className="space-y-3">
            <ColorInput label="Text" value={footer.textColor || theme.colors.text} onChange={(v) => updateTheme({ footer: { ...footer, textColor: v } })} />
            <ColorInput label="Muted text" value={footer.textMutedColor || theme.colors.textMuted} onChange={(v) => updateTheme({ footer: { ...footer, textMutedColor: v } })} />
            <ColorInput label="Accent / links" value={footer.accentColor || theme.colors.primary} onChange={(v) => updateTheme({ footer: { ...footer, accentColor: v } })} />
            <ColorInput label="Top border" value={footer.borderColor || theme.colors.textMuted} onChange={(v) => updateTheme({ footer: { ...footer, borderColor: v } })} />
          </div>
        </PanelSection>

        <PanelSection title="Footer content alignment">
          <div className="space-y-3">
            <OptionGroup
              value={footer.alignment || "center"}
              options={[
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ]}
              onChange={(v) => updateTheme({ footer: { ...footer, alignment: v as "left" | "center" | "right" } })}
            />
            <OptionGroup
              value={footer.padding || "md"}
              options={[
                { value: "sm", label: "Small padding" },
                { value: "md", label: "Medium padding" },
                { value: "lg", label: "Large padding" },
              ]}
              onChange={(v) => updateTheme({ footer: { ...footer, padding: v as "sm" | "md" | "lg" } })}
            />
          </div>
        </PanelSection>
      </LayoutGroup>

      <LayoutGroup title="Floating widgets" subtitle="Chat button, visitor counter, scroll bar" defaultOpen={false}>
        <ToggleList
          items={[
            { key: "showScrollProgress", label: "Scroll progress bar" },
            { key: "showAvailabilityBadge", label: "Availability badge" },
            { key: "showVisitorsCounter", label: "Visitors counter" },
            { key: "liveChatEnabled", label: "Live chat widget" },
          ]}
          values={{
            showScrollProgress: !!theme.features.showScrollProgress,
            showAvailabilityBadge: !!theme.features.showAvailabilityBadge,
            showVisitorsCounter: !!theme.features.showVisitorsCounter,
            liveChatEnabled: !!theme.features.liveChatEnabled,
          }}
          onChange={(key, v) => updateTheme({ features: { ...theme.features, [key]: v } })}
        />
        {theme.features.liveChatEnabled && (
          <div className="mt-3 space-y-2">
            <OptionGroup
              value={theme.features.liveChatType}
              options={[
                { value: "whatsapp", label: "WhatsApp" },
                { value: "telegram", label: "Telegram" },
              ]}
              onChange={(v) => updateTheme({ features: { ...theme.features, liveChatType: v as "whatsapp" | "telegram" } })}
            />
            <input
              type="text"
              value={theme.features.liveChatUrl || ""}
              onChange={(e) => updateTheme({ features: { ...theme.features, liveChatUrl: e.target.value } })}
              onBlur={(e) =>
                updateTheme({
                  features: {
                    ...theme.features,
                    liveChatUrl: normalizeLiveChatUrl(e.target.value, theme.features.liveChatType),
                  },
                })
              }
              placeholder="wa.me/1234567890 or phone number"
              className="input-field text-sm"
            />
          </div>
        )}
      </LayoutGroup>
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";

export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <h3
        className="text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: "var(--app-text-muted)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent"
        style={{ border: "1px solid var(--app-border)" }}
      />
      <div className="flex-1">
        <p className="text-xs" style={{ color: "var(--app-text-muted)" }}>
          {label}
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field text-xs mt-0.5 py-1"
        />
      </div>
    </div>
  );
}

export function OptionGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
            style={
              active
                ? {
                    background: "var(--app-primary)",
                    color: "#fff",
                    borderColor: "var(--app-primary)",
                  }
                : {
                    background: "var(--app-input-bg)",
                    color: "var(--app-text-muted)",
                    borderColor: "var(--app-border)",
                  }
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ToggleList({
  items,
  values,
  onChange,
}: {
  items: { key: string; label: string }[];
  values: Record<string, boolean>;
  onChange: (key: string, val: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-3 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={values[key] ?? false}
            onChange={(e) => onChange(key, e.target.checked)}
            className="rounded accent-violet-600"
          />
          <span className="text-sm" style={{ color: "var(--app-text)" }}>
            {label}
          </span>
        </label>
      ))}
    </div>
  );
}

/** Shared surface styles for list rows inside the editor */
export const editorRowClass = "flex items-center gap-2 p-2 rounded-lg border";
export function editorRowStyle(): CSSProperties {
  return {
    borderColor: "var(--app-border)",
    background: "var(--app-input-bg)",
  };
}

export function editorMutedTextStyle(): CSSProperties {
  return { color: "var(--app-text-muted)" };
}

export function editorTextStyle(): CSSProperties {
  return { color: "var(--app-text)" };
}

export function editorPrimaryTextStyle(): CSSProperties {
  return { color: "var(--app-primary)" };
}

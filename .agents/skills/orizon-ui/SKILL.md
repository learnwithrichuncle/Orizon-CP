---
name: orizon-ui
description: Comprehensive UI/UX Design System and component implementation guide for Orizon Control Plane (CP) and web applications. Use when creating, modifying, or styling any pages, features, or components to ensure 100% aesthetic and architectural fidelity to the Orizon dark cyberpunk/engineering design language.
---

# Orizon Design System & UI/UX Skill Guide

The **Orizon Design System** is an engineering-first, cyberpunk-inspired, sharp-edge dark mode interface built for cloud infrastructure control planes and high-performance developer tools.

---

## 1. Design Tokens & Theme Configuration

### 1.1 Fonts
```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Unbounded:wght@500;700;800&display=swap");

@theme {
  --font-sans: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-hero: "Unbounded", ui-sans-serif, system-ui, sans-serif;
  --color-orizoncp: #4fb8b2;
}
```

* **Hero & Headings**: `font-hero` (`Unbounded`, weights 500/700/800) - Used for page headers, section titles, brand marks, and large stat numbers.
* **Body & Content**: `font-sans` (`Space Grotesk`, weights 400/500/700) - Used for descriptions, prose, and general UI text.
* **Metadata, Labels & Micro-UI**: `font-mono` (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`) - Used for labels, badges, status pills, tags, chips, timestamps, commit hashes, and telemetry data.

### 1.2 Color Palette

| Token | Hex / Value | Usage |
|---|---|---|
| **Canvas / Body** | `#0d0f14` | Global root page background |
| **Primary Accent** | `#4fb8b2` (Orizon Teal) | Active state, highlights, primary buttons, borders |
| **Accent Text** | `#7fe3dd` | High-contrast teal text on dark backgrounds |
| **Surface (High)** | `bg-zinc-900/98` / `border-zinc-700/90` | Floating modals, dialogs, dropdown menus |
| **Surface (Base)** | `bg-zinc-900/70` to `bg-zinc-900/90` | Cards, panels, list containers |
| **Surface (Subtle)** | `bg-zinc-950/80` | Inner wells, code blocks, terminal logs |
| **Borders** | `border-zinc-800` to `border-zinc-700` | Grid separators, structural partitions |

### 1.3 Geometric Aesthetics: Sharp Edges & Zero Radius
* **No Rounded Corners**: Buttons, input boxes, modal containers, cards, and dropdowns use **zero border radius** (`rounded-none` or default square edges).
* **Borders & Dividers**: 1px subtle zinc borders (`border border-zinc-700/80` or `border border-zinc-800`).

---

## 2. Core UI Primitives

### 2.1 Shell Buttons (`shellButton`)

```tsx
export function shellButton(variant: "primary" | "secondary" | "ghost" | "danger" = "secondary") {
  const base = "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap px-3.5 py-2.5 text-center font-mono text-[11px] font-semibold uppercase leading-none tracking-normal transition disabled:opacity-60";

  if (variant === "primary") {
    return `${base} border border-[#4FB8B2]/45 bg-[#4FB8B2]/15 text-[#7fe3dd] hover:bg-[#4FB8B2]/25`;
  }
  if (variant === "danger") {
    return `${base} border border-rose-500/35 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15`;
  }
  if (variant === "ghost") {
    return `${base} px-3 text-zinc-300 hover:bg-zinc-800 hover:text-white`;
  }
  return `${base} border border-zinc-800 bg-zinc-900/70 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900`;
}
```

### 2.2 Surface & Card Container

```tsx
export function surfaceClass(extra = "") {
  return `border border-zinc-700/90 bg-zinc-900/98 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${extra}`.trim();
}
```

### 2.3 Form Inputs (`FormInput`)

```tsx
export const FormInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    variant?: "default" | "monochrome";
  }
>(({ variant = "default", className = "", ...props }, ref) => {
  const focusClass =
    variant === "monochrome"
      ? "focus:border-white focus:ring-2 focus:ring-white/10"
      : "focus:border-[#4FB8B2]/60";
  return (
    <input
      {...props}
      ref={ref}
      className={`h-11 w-full border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 ${focusClass} ${className}`}
    />
  );
});
```

### 2.4 Field Labels (`FieldLabel`)

```tsx
export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">
      {children}
    </span>
  );
}
```

### 2.5 Section Titles (`SectionTitle`)

```tsx
export function SectionTitle({ icon, title, meta }: { icon: unknown; title: string; meta?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center border border-[#4FB8B2]/35 bg-[#4FB8B2]/10 text-[#7fe3dd]">
        <AppIcon icon={icon} size={18} />
      </div>
      <div>
        <h2 className="font-hero text-lg tracking-tight text-zinc-100">{title}</h2>
        {meta ? <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">{meta}</p> : null}
      </div>
    </div>
  );
}
```

---

## 3. Status Badges & Deployment State Matrix

| Status | Border / Background / Text Classes |
|---|---|
| **Active / Running / Deployed / Success** | `border border-emerald-500/30 bg-emerald-500/10 text-emerald-300` |
| **Current / Selected** | `border border-violet-500/35 bg-violet-500/12 text-violet-200` |
| **Building / Queued** | `border border-amber-500/30 bg-amber-500/10 text-amber-300` |
| **Crashed / Degraded** | `border border-orange-500/30 bg-orange-500/10 text-orange-300` |
| **Failed** | `border border-rose-500/30 bg-rose-500/10 text-rose-300` |
| **Aborted / Inactive** | `border border-zinc-600 bg-zinc-800/80 text-zinc-200` |

### Status Pill Component

```tsx
export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${statusClass(status)}`}>
      {status}
    </span>
  );
}
```

---

## 4. Modal & Dialog Shell Architecture

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
  <div className="w-full max-w-2xl border border-zinc-700 bg-zinc-900 shadow-2xl flex flex-col max-h-[90vh]">
    {/* Header */}
    <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center border border-[#4FB8B2]/35 bg-[#4FB8B2]/10 text-[#7fe3dd]">
          <AppIcon icon={IconComponent} size={16} />
        </div>
        <h3 className="font-hero text-base font-medium text-zinc-100">{title}</h3>
      </div>
      <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200">
        <AppIcon icon={Cancel01Icon} size={18} />
      </button>
    </div>

    {/* Body */}
    <div className="overflow-y-auto p-6 space-y-4">
      {children}
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 border-t border-zinc-800 bg-zinc-950/40 px-6 py-4">
      <button onClick={onClose} className={shellButton("ghost")}>Cancel</button>
      <button onClick={onConfirm} className={shellButton("primary")}>Save Changes</button>
    </div>
  </div>
</div>
```

---

## 5. Layout Architecture & Top Navigation

* **Root Container**: Full viewport width and height with dark background `#0d0f14`.
* **Header Bar**: Fixed or sticky height 64px (`h-16`), `border-b border-zinc-800 bg-zinc-950/90 backdrop-blur`. Contains Brand mark, project selector, and user settings actions.
* **Content Area**: Centered container `max-w-7xl mx-auto px-6 py-8` with vertical rhythm of `space-y-6` or `space-y-8`.
* **Sidebar / Sub-nav**: Vertical stack of monospace uppercase links with teal left-border highlight when active.

---

## 6. Checklists for New Pages & Components

1. [ ] Use `font-hero` (`Unbounded`) for high-level headings.
2. [ ] Use `font-mono` with uppercase tracking (`tracking-[0.16em]` to `tracking-[0.2em]`) for metadata, pills, tags, chips, and small labels.
3. [ ] Enforce zero border radius (`rounded-none` or sharp squares).
4. [ ] Use `#4fb8b2` and `#7fe3dd` for active/primary interactions.
5. [ ] Ensure dark backgrounds (`#0d0f14` body, `bg-zinc-900` card surfaces, `bg-zinc-950` wells).
6. [ ] Apply `border border-zinc-700` or `border-zinc-800` for crisp layout definition.

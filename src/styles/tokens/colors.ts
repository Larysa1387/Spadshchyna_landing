/** Spadshchyna palette — each hex defined once (Canva / Design PDF) */
export const palette = {
  brown900: '#3a291b',
  brown950: '#2a1e14',
  brown800: '#635136',
  brown700: '#7b6443',
  brown500: '#8d7d71',
  accent600: '#a1600a',
  accent700: '#874f08',
  gold500: '#b79c72',
  tan500: '#a28059',
  cream100: '#f5f1e9',
  sand200: '#cec5bc',
  white: '#ffffff',
  black: '#000000',
  success: '#3d7a4a',
  warning: '#c9922a',
  error: '#c0392b',
  info: '#3a6ea5',
} as const;

const {
  brown900,
  brown950,
  brown800,
  brown700,
  brown500,
  accent600,
  accent700,
  gold500,
  tan500,
  cream100,
  sand200,
  white,
  black,
  success,
  warning,
  error,
  info,
} = palette;

/** Semantic color roles — alias palette tokens, no duplicate hex values */
export const colors = {
  brand: {
    primary: brown900,
    primaryHover: brown950,
    accent: accent600,
    accentHover: accent700,
    gold: gold500,
    goldHover: tan500,
  },
  neutral: {
    white,
    cream: cream100,
    sand: sand200,
    brown400: brown500,
    brown500: brown700,
    brown600: brown800,
    black,
  },
  semantic: {
    success,
    warning,
    error,
    info,
  },
  surface: {
    page: cream100,
    card: white,
    overlay: 'rgba(58, 41, 27, 0.55)',
    border: sand200,
    borderStrong: gold500,
  },
  text: {
    primary: brown900,
    secondary: brown700,
    muted: brown500,
    inverse: white,
    link: accent600,
    linkHover: accent700,
    label: brown800,
    sectionLabel: gold500,
  },
} as const;

export type ColorTokenPath =
  | `palette.${keyof typeof palette}`
  | `brand.${keyof typeof colors.brand}`
  | `neutral.${keyof typeof colors.neutral}`
  | `semantic.${keyof typeof colors.semantic}`
  | `surface.${keyof typeof colors.surface}`
  | `text.${keyof typeof colors.text}`;

/** CSS custom properties for applyDesignTokens() */
export const colorCssVariables = {
  '--color-brand-primary': colors.brand.primary,
  '--color-brand-primary-hover': colors.brand.primaryHover,
  '--color-brand-accent': colors.brand.accent,
  '--color-brand-accent-hover': colors.brand.accentHover,
  '--color-brand-gold': colors.brand.gold,
  '--color-brand-gold-hover': colors.brand.goldHover,
  '--color-neutral-white': colors.neutral.white,
  '--color-neutral-cream': colors.neutral.cream,
  '--color-neutral-sand': colors.neutral.sand,
  '--color-neutral-brown-400': colors.neutral.brown400,
  '--color-neutral-brown-500': colors.neutral.brown500,
  '--color-neutral-brown-600': colors.neutral.brown600,
  '--color-neutral-black': colors.neutral.black,
  '--color-semantic-success': colors.semantic.success,
  '--color-semantic-warning': colors.semantic.warning,
  '--color-semantic-error': colors.semantic.error,
  '--color-semantic-info': colors.semantic.info,
  '--color-surface-page': colors.surface.page,
  '--color-surface-card': colors.surface.card,
  '--color-surface-overlay': colors.surface.overlay,
  '--color-surface-border': colors.surface.border,
  '--color-surface-border-strong': colors.surface.borderStrong,
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-text-muted': colors.text.muted,
  '--color-text-inverse': colors.text.inverse,
  '--color-text-link': colors.text.link,
  '--color-text-link-hover': colors.text.linkHover,
  '--color-text-label': colors.text.label,
  '--color-text-section-label': colors.text.sectionLabel,
} as const;

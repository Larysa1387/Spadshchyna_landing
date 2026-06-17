/** Extracted from Spadshchyna_Design_0806.pdf */
export const colors = {
  brand: {
    primary: '#3a291b',
    primaryHover: '#2a1e14',
    accent: '#a1600a',
    accentHover: '#874f08',
    gold: '#b79c72',
    goldHover: '#a28059',
    tan: '#a28059',
  },
  neutral: {
    white: '#ffffff',
    cream: '#f5f1e9',
    sand: '#cec5bc',
    brown400: '#8d7d71',
    brown500: '#7b6443',
    brown600: '#635136',
    brown700: '#7c6544',
    black: '#000000',
  },
  semantic: {
    success: '#3d7a4a',
    warning: '#c9922a',
    error: '#c0392b',
    info: '#3a6ea5',
  },
  surface: {
    page: '#f5f1e9',
    card: '#ffffff',
    overlay: 'rgba(58, 41, 27, 0.55)',
    border: '#cec5bc',
    borderStrong: '#b79c72',
  },
  text: {
    primary: '#3a291b',
    secondary: '#7b6443',
    muted: '#8d7d71',
    inverse: '#ffffff',
    link: '#a1600a',
    linkHover: '#874f08',
    label: '#635136',
    sectionLabel: '#b79c72',
  },
} as const;

export type ColorTokenPath =
  | `brand.${keyof typeof colors.brand}`
  | `neutral.${keyof typeof colors.neutral}`
  | `semantic.${keyof typeof colors.semantic}`
  | `surface.${keyof typeof colors.surface}`
  | `text.${keyof typeof colors.text}`;

export const colorCssVariables = {
  '--color-brand-primary': colors.brand.primary,
  '--color-brand-primary-hover': colors.brand.primaryHover,
  '--color-brand-accent': colors.brand.accent,
  '--color-brand-accent-hover': colors.brand.accentHover,
  '--color-brand-gold': colors.brand.gold,
  '--color-brand-gold-hover': colors.brand.goldHover,
  '--color-brand-tan': colors.brand.tan,
  '--color-neutral-white': colors.neutral.white,
  '--color-neutral-cream': colors.neutral.cream,
  '--color-neutral-sand': colors.neutral.sand,
  '--color-neutral-brown-400': colors.neutral.brown400,
  '--color-neutral-brown-500': colors.neutral.brown500,
  '--color-neutral-brown-600': colors.neutral.brown600,
  '--color-neutral-brown-700': colors.neutral.brown700,
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

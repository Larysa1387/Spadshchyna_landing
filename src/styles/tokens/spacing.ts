export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const layout = {
  contentMaxWidth: '75rem',
  contentPaddingMobile: spacing[4],
  contentPaddingTablet: spacing[6],
  contentPaddingDesktop: spacing[8],
  sectionGapMobile: spacing[12],
  sectionGapDesktop: spacing[20],
} as const;

export const radius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export const shadow = {
  sm: '0 1px 2px rgba(26, 24, 20, 0.06)',
  md: '0 4px 12px rgba(26, 24, 20, 0.08)',
  lg: '0 12px 32px rgba(26, 24, 20, 0.12)',
} as const;

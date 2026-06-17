import { colorCssVariables } from '../tokens/colors';
import { layout, radius, shadow, spacing } from '../tokens/spacing';
import { fontFamily } from '../tokens/typography';

const layoutCssVariables = {
  '--layout-content-max-width': layout.contentMaxWidth,
  '--layout-content-padding-mobile': layout.contentPaddingMobile,
  '--layout-content-padding-tablet': layout.contentPaddingTablet,
  '--layout-content-padding-desktop': layout.contentPaddingDesktop,
  '--layout-section-gap-mobile': layout.sectionGapMobile,
  '--layout-section-gap-desktop': layout.sectionGapDesktop,
  '--font-family-heading': fontFamily.heading,
  '--font-family-body': fontFamily.body,
  '--radius-sm': radius.sm,
  '--radius-md': radius.md,
  '--radius-lg': radius.lg,
  '--radius-xl': radius.xl,
  '--radius-full': radius.full,
  '--shadow-sm': shadow.sm,
  '--shadow-md': shadow.md,
  '--shadow-lg': shadow.lg,
  '--space-1': spacing[1],
  '--space-2': spacing[2],
  '--space-3': spacing[3],
  '--space-4': spacing[4],
  '--space-5': spacing[5],
  '--space-6': spacing[6],
  '--space-8': spacing[8],
  '--space-10': spacing[10],
  '--space-12': spacing[12],
  '--space-16': spacing[16],
  '--space-20': spacing[20],
  '--space-24': spacing[24],
} as const;

export function applyDesignTokens(
  root: HTMLElement = document.documentElement,
): void {
  const tokens = {
    ...colorCssVariables,
    ...layoutCssVariables,
  };

  Object.entries(tokens).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}

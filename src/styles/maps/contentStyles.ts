import type { Breakpoint } from '../tokens/breakpoints';
import {
  fontFamily,
  fontWeight,
  letterSpacing,
  type TextStyleDefinition,
} from '../tokens/typography';

export type ResponsiveValue<T> = Record<Breakpoint, T>;

export type ContentStyleKey =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'quoteEmphasis'
  | 'subtitle'
  | 'bodyLg'
  | 'body'
  | 'bodySm'
  | 'caption'
  | 'sectionLabel'
  | 'button'
  | 'navLink'
  | 'tagline';

/** Sizes mapped from PDF pt values (mobile = design baseline, scaled up on larger breakpoints) */
export const contentStyleMap = {
  display: {
    mobile: {
      fontFamily: fontFamily.heading,
      fontSize: '2.625rem',
      lineHeight: '1.1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.tight,
    },
    tablet: {
      fontFamily: fontFamily.heading,
      fontSize: '3.5rem',
      lineHeight: '1.08',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.tight,
    },
    desktop: {
      fontFamily: fontFamily.heading,
      fontSize: '4.125rem',
      lineHeight: '1.05',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.tight,
    },
  },
  h1: {
    mobile: {
      fontFamily: fontFamily.heading,
      fontSize: '1.75rem',
      lineHeight: '1.15',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
    tablet: {
      fontFamily: fontFamily.heading,
      fontSize: '2.25rem',
      lineHeight: '1.12',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
    desktop: {
      fontFamily: fontFamily.heading,
      fontSize: '2.625rem',
      lineHeight: '1.1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
  },
  h2: {
    mobile: {
      fontFamily: fontFamily.heading,
      fontSize: '1.5rem',
      lineHeight: '1.2',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
    tablet: {
      fontFamily: fontFamily.heading,
      fontSize: '1.875rem',
      lineHeight: '1.15',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
    desktop: {
      fontFamily: fontFamily.heading,
      fontSize: '2rem',
      lineHeight: '1.12',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
  },
  h3: {
    mobile: {
      fontFamily: fontFamily.heading,
      fontSize: '1.125rem',
      lineHeight: '1.25',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
    tablet: {
      fontFamily: fontFamily.heading,
      fontSize: '1.25rem',
      lineHeight: '1.22',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
    desktop: {
      fontFamily: fontFamily.heading,
      fontSize: '1.375rem',
      lineHeight: '1.2',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
  },
  quote: {
    mobile: {
      fontFamily: fontFamily.heading,
      fontSize: '1.5rem',
      lineHeight: '1.25',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
    tablet: {
      fontFamily: fontFamily.heading,
      fontSize: '1.75rem',
      lineHeight: '1.22',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
    desktop: {
      fontFamily: fontFamily.heading,
      fontSize: '1.875rem',
      lineHeight: '1.2',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
    },
  },
  quoteEmphasis: {
    mobile: {
      fontFamily: fontFamily.headingItalic,
      fontSize: '1.5rem',
      lineHeight: '1.25',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
      fontStyle: 'italic',
    },
    tablet: {
      fontFamily: fontFamily.headingItalic,
      fontSize: '1.75rem',
      lineHeight: '1.22',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
      fontStyle: 'italic',
    },
    desktop: {
      fontFamily: fontFamily.headingItalic,
      fontSize: '1.875rem',
      lineHeight: '1.2',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
      fontStyle: 'italic',
    },
  },
  subtitle: {
    mobile: {
      fontFamily: fontFamily.body,
      fontSize: '0.8125rem',
      lineHeight: '1.5',
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
    },
    tablet: {
      fontFamily: fontFamily.body,
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
    },
    desktop: {
      fontFamily: fontFamily.body,
      fontSize: '0.9375rem',
      lineHeight: '1.55',
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
    },
  },
  bodyLg: {
    mobile: {
      fontFamily: fontFamily.body,
      fontSize: '0.875rem',
      lineHeight: '1.55',
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.normal,
    },
    tablet: {
      fontFamily: fontFamily.body,
      fontSize: '0.9375rem',
      lineHeight: '1.55',
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.normal,
    },
    desktop: {
      fontFamily: fontFamily.body,
      fontSize: '1rem',
      lineHeight: '1.6',
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.normal,
    },
  },
  body: {
    mobile: {
      fontFamily: fontFamily.body,
      fontSize: '0.8125rem',
      lineHeight: '1.55',
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
    },
    tablet: {
      fontFamily: fontFamily.body,
      fontSize: '0.875rem',
      lineHeight: '1.55',
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
    },
    desktop: {
      fontFamily: fontFamily.body,
      fontSize: '0.875rem',
      lineHeight: '1.6',
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
    },
  },
  bodySm: {
    mobile: {
      fontFamily: fontFamily.body,
      fontSize: '0.75rem',
      lineHeight: '1.5',
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
    },
    tablet: {
      fontFamily: fontFamily.body,
      fontSize: '0.75rem',
      lineHeight: '1.5',
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
    },
    desktop: {
      fontFamily: fontFamily.body,
      fontSize: '0.8125rem',
      lineHeight: '1.55',
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
    },
  },
  caption: {
    mobile: {
      fontFamily: fontFamily.body,
      fontSize: '0.6875rem',
      lineHeight: '1.4',
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.wide,
    },
    tablet: {
      fontFamily: fontFamily.body,
      fontSize: '0.6875rem',
      lineHeight: '1.4',
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.wide,
    },
    desktop: {
      fontFamily: fontFamily.body,
      fontSize: '0.75rem',
      lineHeight: '1.4',
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.wide,
    },
  },
  sectionLabel: {
    mobile: {
      fontFamily: fontFamily.body,
      fontSize: '0.6875rem',
      lineHeight: '1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.wider,
    },
    tablet: {
      fontFamily: fontFamily.body,
      fontSize: '0.6875rem',
      lineHeight: '1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.wider,
    },
    desktop: {
      fontFamily: fontFamily.body,
      fontSize: '0.75rem',
      lineHeight: '1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.wider,
    },
  },
  button: {
    mobile: {
      fontFamily: fontFamily.body,
      fontSize: '0.8125rem',
      lineHeight: '1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.nav,
    },
    tablet: {
      fontFamily: fontFamily.body,
      fontSize: '0.8125rem',
      lineHeight: '1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.nav,
    },
    desktop: {
      fontFamily: fontFamily.body,
      fontSize: '0.875rem',
      lineHeight: '1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.nav,
    },
  },
  navLink: {
    mobile: {
      fontFamily: fontFamily.body,
      fontSize: '0.6875rem',
      lineHeight: '1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.nav,
    },
    tablet: {
      fontFamily: fontFamily.body,
      fontSize: '0.75rem',
      lineHeight: '1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.nav,
    },
    desktop: {
      fontFamily: fontFamily.body,
      fontSize: '0.8125rem',
      lineHeight: '1',
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.nav,
    },
  },
  tagline: {
    mobile: {
      fontFamily: fontFamily.body,
      fontSize: '0.5rem',
      lineHeight: '1.3',
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.wider,
    },
    tablet: {
      fontFamily: fontFamily.body,
      fontSize: '0.5625rem',
      lineHeight: '1.3',
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.wider,
    },
    desktop: {
      fontFamily: fontFamily.body,
      fontSize: '0.5625rem',
      lineHeight: '1.3',
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.wider,
    },
  },
} as const satisfies Record<
  ContentStyleKey,
  ResponsiveValue<TextStyleDefinition>
>;

export function getContentStyle(
  key: ContentStyleKey,
  breakpoint: Breakpoint,
): TextStyleDefinition {
  return contentStyleMap[key][breakpoint];
}

export function contentStyleToCssProperties(
  style: TextStyleDefinition,
): Record<string, string> {
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    fontWeight: String(style.fontWeight),
    letterSpacing: style.letterSpacing,
    ...(style.fontStyle ? { fontStyle: style.fontStyle } : {}),
  };
}

export function getContentStyleCssProperties(
  key: ContentStyleKey,
  breakpoint: Breakpoint,
): Record<string, string> {
  return contentStyleToCssProperties(getContentStyle(key, breakpoint));
}

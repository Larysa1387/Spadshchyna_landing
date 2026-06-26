/** Extracted from Spadshchyna_Design_0806.pdf */
export const fontFamily = {
  heading: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
  headingItalic: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
  body: '"Priva One Pro", system-ui, -apple-system, sans-serif',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const letterSpacing = {
  tight: '-0.01em',
  normal: '0',
  wide: '0.12em',
  wider: '0.24em',
  nav: '0.18em',
} as const;

export type TextStyleDefinition = {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
  fontStyle?: 'normal' | 'italic';
};

/** Production site copy (corrected from Spadshchyna_Design_0806.pdf) */

export const brand = {
  name: 'Spadshchyna',
  tagline: 'ETHNO-HOMESTEAD ARCHIVE OF UKRAINE',
  footer: {
    copyright: '2026 Spadshchyna',
    madeWith: 'Made with Love to Ukraine',
  },
} as const;

export const navigation = {
  homesteads: 'HOMESTEADS',
  favourites: 'FAVOURITES',
  login: 'LOG IN',
  logout: 'LOG OUT',
} as const;

export const homePage = {
  hero: {
    title: ['Discover', 'the Living Heritage', 'of Ukraine'],
    subtitle:
      'An ethno-homestead archive preserving the soul of Ukrainian traditions.',
    cta: 'Discover Homesteads Archive',
  },
} as const;

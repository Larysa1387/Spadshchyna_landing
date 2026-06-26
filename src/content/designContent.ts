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
  howItWorks: {
    label: 'HOW IT WORKS',
    title: 'The Philosophy of Living Heritage',
    subtitle:
      'We connect authentic rural living with modern responsible tourism.',
    pillars: [
      {
        title: '5% to Restore Homesteads',
        description:
          'From every booking, 5% goes to a charitable fund for the restoration of historic homesteads across Ukraine. You help preserve living history.',
      },
      {
        title: 'Local Experiences & Traditions',
        description:
          'Every homestead carefully preserves culinary and craft traditions of its region. Learn more about ethnic decor, floral gardens, or traditional cuisine.',
      },
      {
        title: '100% Verified Homesteads',
        description:
          'All homesteads are personally verified. We check fire safety, water quality, bed linen cleanliness, and the availability of hot showers and Wi-Fi.',
      },
    ],
  },
  quote: {
    before: 'Our goal is to make heritage a',
    emphasis: 'living',
    after: 'experience.',
  },
  archive: {
    title: 'Homesteads Archive',
    description:
      'Carefully selected for their historical and architectural value.',
    priceSuffix: 'UAH / night',
    fairPrice: 'FAIR PRICE',
    details: 'Details',
    filters: {
      region: 'Region',
      price: 'Price',
      rating: 'Rating',
      allRegions: 'All regions',
      anyPrice: 'Any price',
      anyRating: 'All',
      ratingMiddle: '4.6 – 4.8',
      ratingHigh: '4.8+',
    },
  },
} as const;

export const homesteads = [
  {
    homesteadId: 1,
    id: 'forest-keepers-homestead',
    region: 'POLISSIA',
    location: 'Polissia Village',
    rating: 4.92,
    title: "Forest Keeper's Homestead",
    description:
      'A secluded wooden house nestled among ancient pines, preserving the quiet rhythms and traditions of Polissian life...',
    tags: ['Birdwatching', 'Forest retreat', 'Traditional sauna'],
    extraPhotos: 1,
    price: 2700,
  },
  {
    homesteadId: 2,
    id: 'onishchyna-honchars-house',
    region: 'POLTAVSHCHYNA',
    location: 'Onishchyna village',
    rating: 4.8,
    title: "Onishchyna Honchar's House",
    description:
      'A handmade 19th-century house where every detail reveals amazing secrets...',
    tags: ['Clay stove', "Potter's wheel", 'Authentic dishes'],
    extraPhotos: 4,
    price: 1800,
    image: '/assets/homestead/onishchyna-honchars-house',
  },
  {
    homesteadId: 3,
    id: 'the-weavers-house',
    region: 'BUKOVYNA',
    location: 'Kosmach Village',
    rating: 4.6,
    title: "The Weaver's House",
    description:
      'An authentic mountain dwelling where local craftsmanship, handwoven textiles, and centuries-old customs remain alive...',
    tags: ['Handwoven textiles', 'Loom workshop', 'Handmade'],
    extraPhotos: 2,
    price: 3200,
  },
  {
    homesteadId: 4,
    id: 'the-orchard-house',
    region: 'KHERSONSHCHYNA',
    location: 'Kherson village',
    rating: 4.6,
    title: 'The Orchard House',
    description:
      'A cozy family homestead embraced by fruit trees and rolling hills, where every season paints a different story...',
    tags: ['Orchard harvest', 'Traditional recipes', 'Flower garden'],
    extraPhotos: 5,
    price: 790,
  },
  {
    homesteadId: 5,
    id: 'podillian-white-cottage',
    region: 'Halychyna',
    location: 'Borshchiv Area',
    rating: 4.92,
    title: 'Podillian White Cottage',
    description:
      'A charming whitewashed home where embroidered linens, blooming gardens, and family stories have endured for generations...',
    tags: ['Whitewashed walls', 'Heritage tours', 'Historic vibe'],
    extraPhotos: 3,
    price: 4400,
  },
  {
    homesteadId: 6,
    id: 'the-cossack-homestead',
    region: 'KHMELNYTSKYI',
    location: 'Khmelnytskyi Region',
    rating: 4.8,
    title: 'The Cossack Homestead',
    description:
      'A restored 19th-century estate where wooden architecture, folk legends, and the legacy of the Cossack era meet...',
    tags: ['Folk storytelling', 'Heritage tours', 'Historic vibe'],
    extraPhotos: 2,
    price: 2100,
  },
  {
    homesteadId: 7,
    id: 'the-honey-farm-retreat-1',
    region: 'VOLYN',
    location: 'Boyko Highlands',
    rating: 4.8,
    title: 'The Honey Farm Retreat',
    description:
      'A peaceful countryside home surrounded by orchards and apiaries, offering a glimpse into the traditions of rural Ukraine...',
    tags: ['Local honey tasting', 'Beekeeping experience'],
    extraPhotos: 2,
    price: 1200,
  },
  {
    homesteadId: 8,
    id: 'the-timber-mountain-house',
    region: 'KHARKIVSHCHYNA',
    location: 'Slobozhanshchyna Region',
    rating: 4.6,
    title: 'The Timber Mountain House',
    description:
      'Built from local spruce and stone, this historic home reflects the resilience, craftsmanship, and beauty of mountain life...',
    tags: ['Hiking routes', 'Mountain views', 'Authentic dishes'],
    extraPhotos: 3,
    price: 3900,
  },
  {
    homesteadId: 9,
    id: 'forest-cottage',
    region: 'KYIVSHCHYNA',
    location: 'Kyiv forests',
    rating: 4.92,
    title: 'Forest Cottage',
    description:
      'A traditional highland retreat surrounded by forests and meadows, where every sunrise brings the spirit closer...',
    tags: ['Fishing spot', 'Outdoor fireplace', 'Traditional breakfast'],
    extraPhotos: 1,
    price: 900,
  },
  {
    homesteadId: 10,
    id: 'carpenters-homestead',
    region: 'LVIVSHCHYNA',
    location: 'Volia Village',
    rating: 4.65,
    title: "Carpenter's Homestead",
    description:
      'A rustic homestead of a master carpenter, featuring a workshop, wooden tools, and timeless craftsmanship...',
    tags: ['Wood workshop', 'Hand tools', 'Wood carving'],
    extraPhotos: 3,
    price: 2000,
  },
  {
    homesteadId: 11,
    id: 'the-honey-farm-retreat-2',
    region: 'ZAKARPATTIA',
    location: 'Kolochava Village',
    rating: 4.83,
    title: 'The Honey Farm Retreat',
    description:
      'A cozy highland cottage once home to shepherds, with stunning views, fresh air, and simple mountain living...',
    tags: ['Mountain views', 'Local cheese'],
    extraPhotos: 2,
    price: 1900,
  },
  {
    homesteadId: 12,
    id: 'carvers-mountain-lodge',
    region: 'IVANO-FRANKIVSHCHYNA',
    location: 'Vorokhta Village',
    rating: 4.9,
    title: "Carver's Mountain Lodge",
    description:
      'A beautifully crafted wooden lodge in the Carpathians, surrounded by forests and rivers, perfect for rest and inspiration...',
    tags: ['Wood carving', 'Hiking trails', 'River nearby'],
    extraPhotos: 1,
    price: 2800,
  },
] as const;

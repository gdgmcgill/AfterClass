import type { Place } from "@/lib/place";

// Fake places for building the UI before real data exists. Not real businesses.
export const samplePlaces: Place[] = [
   {
    id: 'coffee-cafe',
    name: 'Coffee Café',
    category: 'Café',
    priceLevel: 1,
    address: '123 Fake Road, Montreal',
    distanceKm: 0.8,
    openingHours: ['Mon–Fri 7:00 a.m.–7:00 p.m.', 'Sat–Sun 9:00 a.m.–5:00 p.m.'],
    sourceUrl: 'https://example.com/coffee-cafe',
    lastConfirmedDate: '2026-11-10', // verified
  },
  {
    id: 'blues-pub',
    name: 'Blues Pub',
    category: 'Bar',
    priceLevel: 2,
    address: '456 Fake Avenue, Montreal',
    distanceKm: 0.5,
    openingHours: ['Fri 4:00 p.m.–11:00 p.m.'],
    sourceUrl: null,
    lastConfirmedDate: '2021-11-10', // stale
  },
  {
    id: 'gurts-cafe',
    name: 'Gurts Café',
    category: 'Café',
    priceLevel: 1,
    address: '789 Pretend Street, Montreal',
    distanceKm: 1.2,
    openingHours: ['Mon–Sun 11:00 a.m.–10:00 p.m.'],
    sourceUrl: 'https://example.com/gurts-cafe',
    lastConfirmedDate: '2026-11-11', // verified
  },
  {
    id: 'laser-zone',
    name: 'Laser Zone',
    category: 'Laser Tag',
    priceLevel: 2,
    address: '321 Imaginary Boulevard, Montreal',
    distanceKm: 4.3,
    openingHours: null, // missing hours
    sourceUrl: 'https://example.com/laser-zone',
    lastConfirmedDate: '2026-11-09', // verified
  },
  {
    id: 'night-pulse',
    name: 'Night Pulse',
    category: 'Club',
    priceLevel: 3,
    address: '654 Made-Up Street, Montreal',
    distanceKm: 1.9,
    openingHours: ['Thu–Sat 10:00 p.m.–3:00 a.m.'],
    sourceUrl: 'https://example.com/night-pulse',
    lastConfirmedDate: '2026-08-20',
  },
  {
    id: 'brush-and-canvas',
    name: 'Brush and Canvas Painting Studio for Beginners and Curious Minds',
    category: 'Painting Studio',
    priceLevel: 3,
    address: '987 Example Avenue, Montreal',
    distanceKm: 2.7,
    openingHours: ['Tue–Thu 6:00 p.m.–9:00 p.m.', 'Sat 10:00 a.m.–4:00 p.m.'],
    sourceUrl: 'https://example.com/brush-and-canvas',
    lastConfirmedDate: '2026-11-12', // verified, long name to test overflow
  },
  {
    id: 'dragon-kung-fu',
    name: 'Dragon Kung Fu Studio',
    category: 'Kung Fu Studio',
    priceLevel: null,
    address: '147 Sample Road, Montreal',
    distanceKm: null,
    openingHours: null,
    sourceUrl: null,
    lastConfirmedDate: null, // never confirmed, lots of missing fields
  },
];
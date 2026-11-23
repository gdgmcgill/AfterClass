import { Bricolage_Grotesque, Courier_Prime } from 'next/font/google';

// Fonts for the Night Zine look. Kept in one file so the place page can reuse them.
export const zineDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
});

export const zineMono = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

import type { Place } from '@/lib/place';

// A place counts as verified if someone confirmed it within this many days.
// Temporary value: the real rule will come later from the data side.
export const VERIFIED_CUTOFF_DAYS = 30;

export type Freshness = 'verified' | 'stale';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// The only place in the app that decides "verified" vs "stale".
export function getFreshness(place: Place, now: Date = new Date()): Freshness {
  if (place.lastConfirmedDate === null) {
    return 'stale';
  }
  const confirmed = new Date(place.lastConfirmedDate);
  const ageInDays = (now.getTime() - confirmed.getTime()) / MS_PER_DAY;
  return ageInDays <= VERIFIED_CUTOFF_DAYS ? 'verified' : 'stale';
}
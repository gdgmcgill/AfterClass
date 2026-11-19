import Link from 'next/link';
import type { Place } from '@/lib/place';
import { getFreshness, type Freshness } from '@/lib/freshness';
import { zineDisplay, zineMono } from '@/lib/fonts';

// Average walking speed of about 5 km/h, so roughly 12 minutes per km.
const WALK_MINUTES_PER_KM = 12;

type PlaceCardProps = {
  place: Place;
};

export function PlaceCard({ place }: PlaceCardProps) {
  const freshness = getFreshness(place);

  return (
    <Link
      href={`/places/${place.id}`}
      className={`${zineDisplay.className} block border-2 border-[#F3EEE3] bg-[#070D1C] p-4 text-[#F3EEE3] shadow-[6px_6px_0_#ED1B2F] transition-[translate,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#ED1B2F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ED1B2F]`}
    >
      <div className="relative">
        {/* Striped block stands in for the photo until places have images */}
        <div
          aria-hidden="true"
          className="h-28 border-2 border-[#F3EEE3] bg-[repeating-linear-gradient(-45deg,#131C33_0_8px,#0C1428_8px_16px)]"
        />
        <FreshnessStamp freshness={freshness} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <p className={`${zineMono.className} text-[13px] font-bold uppercase tracking-[0.06em] text-[#FF5A69]`}>
          {place.category}
        </p>
        <h3 className="break-words text-[34px] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">
          <ZineName name={place.name} />
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-[15px] font-bold">
          <PriceChip priceLevel={place.priceLevel} />
          <DistanceChips distanceKm={place.distanceKm} />
        </div>
        {place.address !== null && (
          <p className={`${zineMono.className} text-sm text-[#BFC5D3]`}>{place.address}</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t-2 border-[#F3EEE3] pt-3 text-base font-extrabold uppercase">
        <span>See the place</span>
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

// Prints the name with its last word in McGill red, like the flyer headline.
function ZineName({ name }: { name: string }) {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) {
    return <>{name}</>;
  }
  const lastWord = words.pop();
  return (
    <>
      {words.join(' ')} <span className="text-[#ED1B2F]">{lastWord}</span>
    </>
  );
}

function PriceChip({ priceLevel }: { priceLevel: Place['priceLevel'] }) {
  if (priceLevel === null) {
    return <span className="border-2 border-[#8E97AE] px-2.5 py-1 text-[#BFC5D3]">No price info</span>;
  }
  return (
    <span className="bg-[#F3EEE3] px-2.5 py-1.5 text-[#070D1C]">
      <span aria-hidden="true">{'$'.repeat(priceLevel)}</span>
      <span className="sr-only">Price level {priceLevel} of 4</span>
    </span>
  );
}

function DistanceChips({ distanceKm }: { distanceKm: number | null }) {
  if (distanceKm === null) {
    return <span className="border-2 border-[#8E97AE] px-2.5 py-1 text-[#BFC5D3]">No distance info</span>;
  }
  const walkMinutes = Math.max(1, Math.round(distanceKm * WALK_MINUTES_PER_KM));
  const distanceLabel = distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;
  return (
    <>
      <span className="-rotate-[1.5deg] bg-[#ED1B2F] px-2.5 py-1.5 uppercase text-white">{walkMinutes} min walk</span>
      <span className="border-2 border-[#F3EEE3] px-2.5 py-1 font-semibold">{distanceLabel}</span>
    </>
  );
}

// The tilted rubber stamp on the corner of the photo.
function FreshnessStamp({ freshness }: { freshness: Freshness }) {
  const base = `${zineMono.className} absolute -bottom-4 -right-1.5 -rotate-[8deg] border-[3px] bg-[#070D1C] px-2.5 py-1.5 text-[13px] font-bold uppercase`;

  if (freshness === 'verified') {
    return <div className={`${base} border-solid border-[#F3EEE3]`}>✓ Verified</div>;
  }
  return <div className={`${base} border-dashed border-[#F7C25A] text-[#F7C25A]`}>! Stale</div>;
}
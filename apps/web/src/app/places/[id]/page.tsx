import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { FreshnessStamp } from '@/components/FreshnessStamp';
import { getFreshness } from '@/lib/freshness';
import { samplePlaces } from '@/lib/sample-places';

type PlacePageProps = {
  params: Promise<{ id: string }>;
};

// The page itself. It shows "Loading..." until the details are ready.
export default function PlacePage({ params }: PlacePageProps) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PlaceDetails params={params} />
    </Suspense>
  );
}

// Shows one place.
// The address ends with the place's id. Example: /places/blues-pub, so the id is "blues-pub".
async function PlaceDetails({ params }: PlacePageProps) {
  const { id } = await params;
  const place = samplePlaces.find((p) => p.id === id);

  // No place with that id: show the 404 page.
  if (!place) {
    notFound();
  }

  // The freshness depends on today's date, so wait for a real visit before computing it.
  await connection();

  const freshness = getFreshness(place);

  return (
    <main>
      <h1>{place.name}</h1>
      <FreshnessStamp freshness={freshness} />
      <p>{place.category}</p>
      <p>{place.priceLevel ? '$'.repeat(place.priceLevel) : 'Price not available'}</p>
      <p>{place.address ?? 'Address not available'}</p>
      {/* Checked against null so that 0 km still counts as a real value. */}
      <p>{place.distanceKm !== null ? `${place.distanceKm} km` : 'Distance not available'}</p>

      <h2>Opening hours</h2>
      {place.openingHours ? (
        <ul>
          {place.openingHours.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : (
        <p>Hours not available</p>
      )}

      <p>Last confirmed: {place.lastConfirmedDate ?? 'Never confirmed'}</p>

      {place.sourceUrl ? (
        <a href={place.sourceUrl} target="_blank" rel="noopener noreferrer">
          View source
        </a>
      ) : (
        <p>Source not available</p>
      )}
    </main>
  );
}
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { PlaceCard } from '@/components/PlaceCard';
import { samplePlaces } from '@/lib/sample-places';

export default function DevComponentsPage() {
  return (
    <div className="min-h-screen bg-[#070D1C] text-[#F3EEE3]">
      <main className="mx-auto flex max-w-md flex-col gap-6 p-4 pr-6">
        <h1 className="text-xl font-semibold">Component test page</h1>
        <Suspense fallback={<p>Loading…</p>}>
          <SamplePlaceCards />
        </Suspense>
      </main>
    </div>
  );
}

async function SamplePlaceCards() {
  // Wait for a real request, so "Verified" or "Stale" is decided with today's date
  await connection();

  // This page is only for developers: show the 404 page in production.
  if (process.env.APP_ENV === 'production') {
    notFound();
  }

  return samplePlaces.map((place) => <PlaceCard key={place.id} place={place} />);
}
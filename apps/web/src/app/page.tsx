import { Suspense } from 'react';
import { connection } from 'next/server';
import { EventCard } from '@/components/EventCard';
import { fakeEvents } from '@/lib/event/SampleEvents';
 
export default function DevComponentsPage() {
  return (
    <div className="min-h-screen bg-[#070D1C] text-[#F3EEE3]">
      <main className="mx-auto flex max-w-md flex-col gap-6 p-4 pr-6">
        <h1 className="text-xl font-semibold">Component test page</h1>
        <Suspense fallback={<p>Loading…</p>}>
          <SampleEventCards />
        </Suspense>
      </main>
    </div>
  );
}
 
async function SampleEventCards() {
  await connection();
 
  return fakeEvents.map((event) => <EventCard key={event.id} event={event} />);
}
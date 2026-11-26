import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { PlaceCard } from '@/components/PlaceCard';
import { samplePlaces } from '@/lib/sample-places';
import EventCard from '@/components/EventCard';
import PromotionCard from '@/components/PromotionCard';
import { fakeEvents } from '@/lib/event/SampleEvents';
import { fakePromotions } from '@/lib/promotion/SamplePromotions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DevComponentsPage() {
  return (
    <div className="min-h-screen bg-[#070D1C] text-[#F3EEE3]">
      <main className="mx-auto flex max-w-md flex-col gap-6 p-4 pr-6">
        <h1 className="text-xl font-semibold">Component test page</h1>
        <Suspense fallback={<p>Loading…</p>}>
          <SamplePlaceCards />
        </Suspense>
        <h2 className="text-lg font-semibold">Event cards</h2>
        <Suspense fallback={<p>Loading…</p>}>
          <SampleEventCards />
        </Suspense>
        <h2 className="text-lg font-semibold">Promotion cards</h2>
        <Suspense fallback={<p>Loading…</p>}>
          <SamplePromotionCards />
        </Suspense>
        <UiComponents />
      </main>
    </div>
  );
}

async function SamplePlaceCards() {
  // connection() so Verified/Stale uses today's date
  await connection();

  if (process.env.APP_ENV === 'production') {
    notFound();
  }

  return samplePlaces.map((place) => <PlaceCard key={place.id} place={place} />);
}

async function SampleEventCards() {
  // connection() so the Upcoming/Ends soon/Expired status uses today's date
  await connection();

  if (process.env.APP_ENV === 'production') {
    notFound();
  }

  return fakeEvents.map((event) => <EventCard key={event.id} event={event} />);
}

async function SamplePromotionCards() {
  // connection() so the Active/Ends soon/Expired status uses today's date
  await connection();

  if (process.env.APP_ENV === 'production') {
    notFound();
  }

  return fakePromotions.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} />);
}

function UiComponents() {
  const fruits = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
    { label: 'Mango', value: 'mango' },
    { label: 'Grape', value: 'grape' },
    { label: 'Strawberry', value: 'strawberry' },
    { label: 'Peach', value: 'peach' },
    { label: 'Pear', value: 'pear' },
  ];

  return (
    <section className="w-full">
      <h1 className="text-center text-2xl font-bold">UI Components</h1>

      <h2 className="mt-8 mb-2 text-lg font-semibold">Buttons</h2>
      <div className="flex flex-wrap gap-2">
        <Button variant="default">Default</Button>
        <Button variant="default" className="cursor-wait" disabled>
          Loading
        </Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
      </div>

      <h2 className="mt-8 mb-2 text-lg font-semibold">Inputs</h2>
      <Input placeholder="Search for events..." />

      <h2 className="mt-8 mb-2 text-lg font-semibold">Select</h2>
      <Select items={fruits}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <h2 className="mt-8 mb-2 text-lg font-semibold">Cards</h2>
      <Card>
        <CardHeader>
          <CardTitle>Friday Night Bowling</CardTitle>
          <CardDescription>Join us for an evening of strikes and fun</CardDescription>
          <CardAction>
            <Button variant="default">View Event</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Friday, 7:00 PM at Lucky Strike Bowling Lanes</p>
        </CardContent>
      </Card>

      <h2 className="mt-8 mb-2 text-lg font-semibold">Badges</h2>
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </section>
  );
}
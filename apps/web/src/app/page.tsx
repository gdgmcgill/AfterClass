import EventCard from "@/components/EventCard"
import { PlaceCard } from "@/components/PlaceCard"
import { Event } from "@/lib/event/Event";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { connection } from "next/server";
import { Suspense } from "react";
import PromotionCard from "@/components/PromotionCard";
import { fakeEvents } from "@/lib/event/SampleEvents";
import { fakePromotions } from "@/lib/promotion/SamplePromotions";



export default async function Home() {
  return (
    <main className="flex-1 bg-background px-4 py-8 text-foreground">
    <Suspense fallback={<p>Loading events...</p>}>
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>
          Track progress and recent activity for your Next.js app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        Your design system is ready. Start building your next component.
      </CardContent>
    </Card>
    <SampleEventCards></SampleEventCards>
    <SamplePromotionCards></SamplePromotionCards>
    </Suspense>
    </main>
  )
}

async function SampleEventCards() { 
  await connection();

  return fakeEvents.map((event) => <EventCard key={event.id} event={event} />);
}

async function SamplePromotionCards() { 
  await connection();

  return fakePromotions.map((promotion) => <PromotionCard key={promotion.id} promotion={promotion} />);
}
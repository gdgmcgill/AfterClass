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

const fakeEvents: Event[] = [
	{
		id: "event-1",
		title: "Community Meetup",
		startTime: new Date("2027-02-01T10:30:00.000Z"),
		endTime: new Date("2027-02-01T11:30:00.000Z"),
	},
	{
		id: "event-2",
		title: "Past Workshop",
		startTime: new Date("2024-05-01T10:00:00.000Z"),
		endTime: new Date("2024-05-01T11:00:00.000Z"),
	},
	{
		id: "event-3",
		title: "Open House",
		startTime: new Date("2028-03-15T10:00:00.000Z"),
		endTime: new Date("2028-03-15T12:00:00.000Z"),
	},
	{ id: "event-4" },
];

// export const fakePromotions: Promotion[] = [
// 	{
// 		id: "promotion-1",
// 		offerText: "Spring Offer",
// 		startDate: new Date("2025-02-01T00:00:00.000Z"),
// 		endDate: new Date("2025-04-01T00:00:00.000Z"),
// 	},
// 	{
// 		id: "promotion-2",
// 		offerText: "Expired Discount",
// 		startDate: new Date("2024-08-01T00:00:00.000Z"),
// 		endDate: new Date("2024-10-01T00:00:00.000Z"),
// 	},
// 	{
// 		id: "promotion-3",
// 		offerText: "Member Benefit",
// 		startDate: new Date("2025-01-01T00:00:00.000Z"),
// 		endDate: new Date("2025-12-31T00:00:00.000Z"),
// 	},
// 	{ id: "promotion-4" },
// ];

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
    </Suspense>
    </main>
  )
}

async function SampleEventCards() { 
  await connection();

  return fakeEvents.map((event) => <EventCard key={event.id} event={event} />);
}
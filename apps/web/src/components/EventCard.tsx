import Link from "next/link";
import type { Event } from "@/lib/event/Event";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { checkIfExpired } from "@/lib/expiry";


interface EventCardProps {
  event: Event;
}

const LOCALE = "en-US";
// Times are shown exactly as stored (UTC), so "10:30Z" displays as 10:30 AM.
const TIME_ZONE = "UTC";

const dayFormat = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: TIME_ZONE,
});

const timeFormat = new Intl.DateTimeFormat(LOCALE, {
  hour: "numeric",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});



const priceFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "CAD",
});

// Formats the time
function formatWhen(
  start?: Date,
  end?: Date
): string {
  if(!start && !end) return "Date TBA";

  // Only a start: it ends at 23:59 the same day.
  if(start && !end) {
    end = new Date(start);
    end.setUTCHours(23, 59, 0, 0);
  }
  // Only an end: it starts at opening hours that day (0:00 for now).
  if(!start && end) {
    start = new Date(end);
    start.setUTCHours(0, 0, 0, 0);
  }

  // Both exist from here on. ("\n" is rendered by whitespace-pre-line)
  const startText = `${dayFormat.format(start!)} · ${timeFormat.format(start!)}`;

  return `From:\n${startText}\nTo:\n${dayFormat.format(end)}, ${timeFormat.format(end)}`;
}

//Price format
function formatPrice(price?: number): string | null {
  if (price === undefined) return null;

  return price === 0 ? "Free" : priceFormat.format(price);
}



export function EventCard({event}: EventCardProps){
  const title = event.title
  const when = formatWhen(event.startTime, event.endTime)
  const price = formatPrice(event.price)
  const status = checkIfExpired(event.startTime, event.endTime)
  const isExpired = status === "error"
  // With no date, "Ends soon" would be misleading, so say the event is still to come.
  const statusLabel = !event.startTime && !event.endTime && status === "warning"
    ? "Coming soon"
    : { success: "Upcoming", warning: "Ends soon", error: "Expired" }[status]

  return (
    <Link
      href={`/places/${event.place?.id}`}
      className="group mx-auto my-6 block min-h-11 w-[360px] shrink-0 rounded-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring"
    >
      <Card className={`relative rounded-none border-4 border-background bg-linear-to-b ${isExpired ? "from-muted-foreground" : "from-primary"} from-60% to-background font-(family-name:--font-asta-sans) text-lg text-primary-foreground [text-shadow:-1px_-1px_0_var(--foreground),1px_-1px_0_var(--foreground),-1px_1px_0_var(--foreground),1px_1px_0_var(--foreground)] ring-4 ring-foreground inset-ring-4 inset-ring-foreground ${isExpired ? "shadow-[0_0_12px_3px_rgba(255,255,255,0.55),0_0_36px_10px_color-mix(in_oklab,var(--muted-foreground)_55%,transparent)]" : "shadow-[0_0_12px_3px_rgba(255,255,255,0.55),0_0_36px_10px_rgba(237,27,47,0.55)]"} transition-transform duration-200 ease-out motion-safe:group-hover:scale-105 motion-safe:group-active:scale-100`}>
        <CardHeader className="gap-3 text-primary-foreground">
          {/* Status badge on the left, sticker on the right, with space between */}
          <div className="flex items-center justify-between gap-1">
            <Badge
              variant={checkIfExpired(event.startTime, event.endTime)}
              className="h-auto border-2 border-foreground px-2.5 py-0.5 text-xl font-bold uppercase tracking-wider"
            >
              {statusLabel}
            </Badge>
            {/* Sticker telling this card is an event */}
            <span className="shrink-0 rotate-6 rounded-xl border-3 border-foreground px-2 py-1 text-3xl font-extrabold uppercase tracking-normal shadow-[4px_4px_0_var(--foreground)] bg-secondary text-secondary-foreground">
              Event
            </span>
          </div>
          <CardTitle className="break-words font-(family-name:--font-asta-sans) text-3xl font-extrabold leading-tight">
            {title?.trim() || "Untitled event"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Badge
            variant={checkIfExpired(event.startTime, event.endTime)}
            className="h-auto w-full justify-start whitespace-pre-line rounded-lg border-4 border-foreground px-3 py-1.5 text-2xl font-medium tracking-wide"
          >
            {when}
          </Badge>
          <div className="flex flex-col gap-1.5 rounded-lg border-4 border-foreground bg-secondary px-4 py-3 text-secondary-foreground">
            <p className="text-3xl font-bold leading-none tracking-wide">{price ? `Price: ${price}` : "Price TBA"}</p>
            <CardDescription className="break-words text-2xl text-secondary-foreground/85">
              {event.place?.name ? `Place: ${event.place.name}` : "Place TBA"}
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}



export function EventCardGrid({ events }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}




export default EventCard;
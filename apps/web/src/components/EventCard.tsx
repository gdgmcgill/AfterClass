import Link from "next/link";
import type { Event } from "@/lib/event/Event";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


interface EventCardProps {
  event: Event;
}

const LOCALE = "en-US";
const TIME_ZONE = "America/Montreal";

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

function formatDateTime(date:Date): string {
  const parts = dayFormat.formatToParts(date);

  const day = parts.find(p => p.type === "day")?.value;
  const weekday = parts.find(p => p.type === "weekday")?.value
  const month = parts.find(p => p.type === "month")?.value;

  return `${weekday} ${day} ${month}, ${timeFormat.format(date)}`;
}

// An event ending within this window shows as a warning (yellow).
const WARNING_WINDOW_MS = 24 * 60 * 60 * 1000;
type ExpiryStatus = "success" | "warning" | "error";

// Compares the event's end with the current time.
// green (success) = still going, yellow (warning) = ends soon, red (error) = expired.
// Without an end date, the event ends at 23:59 on its start date.
// Returns null when the event has neither date.
export function checkIfExpired(
  start?: Date,
  end?: Date,
): ExpiryStatus {
  const now = new Date()
  let effectiveEnd;
  if (end instanceof Date) {
    effectiveEnd = new Date(end);

  }
  else if (start instanceof Date) {
    effectiveEnd = new Date(start);  
    effectiveEnd.setHours(23, 59, 59, 999);
  } else {
    effectiveEnd = new Date(now);  
    effectiveEnd.setHours(23, 59, 59, 999);
  }

  const msLeft = effectiveEnd.getTime() - now.getTime();

  if (msLeft <= 0) return "error";
  if (msLeft <= WARNING_WINDOW_MS) return "warning";
  return "success";
}



const priceFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "CAD",
});

// Formats the time
function formatWhen(
  start?: Date,
  end?: Date
): string {
  if(start === undefined) return "Undefined";
  
  const startText = `${dayFormat.format(start)} - ${timeFormat.format(start)}`;

  if(!end) return startText;

  const sameDay = dayFormat.format(start) === dayFormat.format(end);

  //Checks if event lasts for more than 1 day (different displays)
  return sameDay
    ? `${startText} – ${timeFormat.format(end)}`
    : `${startText} – ${dayFormat.format(end)} · ${timeFormat.format(end)}`;
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
  return (
    <Link
      href={`/events/${event.id}`}
      className="group mx-auto my-6 block min-h-11 w-full max-w-[352px] rounded-xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring"
    >
      <Card className="rounded-xl border-4 border-background bg-linear-to-b from-primary from-60% to-background font-(family-name:--font-racing-sans) text-base text-primary-foreground [text-shadow:-1px_-1px_0_var(--foreground),1px_-1px_0_var(--foreground),-1px_1px_0_var(--foreground),1px_1px_0_var(--foreground)] ring-4 ring-foreground inset-ring-4 inset-ring-foreground shadow-[0_0_12px_3px_rgba(255,255,255,0.55),0_0_36px_10px_rgba(237,27,47,0.55)] transition-transform duration-200 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-active:translate-y-0">
        <CardHeader className="gap-3 text-primary-foreground">
          <Badge
            variant={checkIfExpired(event.startTime, event.endTime)}
            className="h-auto border-2 border-foreground px-2.5 py-0.5 font-sans text-sm font-bold uppercase tracking-wider"
          >
            {{ success: "Upcoming", warning: "Ends soon", error: "Expired" }[checkIfExpired(event.startTime, event.endTime)]}
          </Badge>
          <CardTitle className="break-words font-(family-name:--font-racing-sans) text-2xl leading-tight">
            {title?.trim() || "Untitled event"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Badge
            variant={checkIfExpired(event.startTime, event.endTime)}
            className="h-auto w-full justify-start whitespace-normal rounded-lg border-4 border-foreground px-3 py-1.5 text-base tracking-wide"
          >
            {checkIfExpired(event.startTime, event.endTime) === "error" && "Expired · "}
            {event.startTime ? when : "Date TBA"}
          </Badge>
          <hr className="border-t-4 border-foreground" />
          <div className="flex flex-col gap-1.5 rounded-lg border-4 border-foreground bg-secondary px-4 py-3 text-secondary-foreground">
            <p className="text-2xl leading-none tracking-wide">{price ?? "Price not listed"}</p>
            <CardDescription className="break-words text-base text-secondary-foreground/85">
              {event.place ?? "Location TBA"}
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
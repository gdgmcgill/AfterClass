import Link from "next/link";
import type { Event } from "@/lib/event/Event";

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


const priceFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "CAD",
});

export function EventCard({ event }: EventCardProps) {
  const title = event.title?.trim() || "Untitled event";
  const when = formatWhen(event.startTime, event.endTime);
  const price = formatPrice(event.price);

  return (
    <Link
      href={`/events/${event.id}`}
      className="flex items-center justify-between gap-4 rounded-lg border p-4 transition hover:bg-gray-50"
    >
      <div className="min-w-0 flex-1">
        {price && (
          <span className="text-sm font-medium text-gray-600">
            {price}
          </span>
        )}

        <h3 className="font-semibold text-gray-900 break-words">
          {title}
        </h3>

        {when && (
          <p className="mt-1 text-sm text-gray-500">{when}</p>
        )}

        {event.place && (
          <p className="text-sm text-gray-500">{event.place}</p>
        )}
      </div>

      <span className="text-gray-400" aria-hidden="true">
        →
      </span>
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




export default EventCard;
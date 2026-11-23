//Still need restriction

import Link from "next/link";
import { Promotion } from "@/lib/promotion/Promotion";

interface PromotionCardProps {
  promotion: Promotion;
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

export function PromotionCard({ promotion }: PromotionCardProps) {
  const title = promotion.offerText?.trim() || "Untitled event";
  const when = formatWhen(promotion.startDate, promotion.endDate);

  return (
    <Link
      href={`/promotions/${promotion.id}`}
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

        {promotion.place && (
          <p className="text-sm text-gray-500">{promotion.place}</p>
        )}
      </div>

      <span className="text-gray-400" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

export function PromotionCardGrid({ promotions }: { promotions: Promotion[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
      {promotions.map((promotion) => (
        <PromotionCard key={promotion.id} promotion={promotion} />
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





export default PromotionCard;
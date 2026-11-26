import Link from "next/link";
import type { Promotion } from "@/lib/promotion/Promotion";
import { checkIfExpired } from "@/lib/expiry";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PromotionCardProps {
  promotion: Promotion;
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

export function PromotionCard({ promotion }: PromotionCardProps) {
  const title = promotion.offerText?.trim() || "Untitled promotion";
  const when = formatWhen(promotion.startDate, promotion.endDate);
  const status = checkIfExpired(promotion.startDate, promotion.endDate);
  const isExpired = status === "error";
  const hasDates = Boolean(promotion.startDate || promotion.endDate);
  // With no dates, "Ends soon" would be misleading, so say the promotion is still to come.
  const statusLabel = !hasDates && status === "warning"
    ? "Coming soon"
    : { success: "Active", warning: "Ends soon", error: "Expired" }[status];
  const restrictions = promotion.restrictions?.filter((r) => r.trim()) ?? [];

  // Same styling as EventCard
  return (
    <Link
      href={`/promotions/${promotion.id}`}
      className="group mx-auto my-6 block min-h-11 w-full max-w-[352px] rounded-xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring"
    >
      <Card className={`relative rounded-xl border-4 border-background bg-linear-to-b ${isExpired ? "from-muted-foreground" : "from-primary"} from-60% to-background font-(family-name:--font-racing-sans) text-lg text-primary-foreground [text-shadow:-1px_-1px_0_var(--foreground),1px_-1px_0_var(--foreground),-1px_1px_0_var(--foreground),1px_1px_0_var(--foreground)] ring-4 ring-foreground inset-ring-4 inset-ring-foreground ${isExpired ? "shadow-[0_0_12px_3px_rgba(255,255,255,0.55),0_0_36px_10px_color-mix(in_oklab,var(--muted-foreground)_55%,transparent)]" : "shadow-[0_0_12px_3px_rgba(255,255,255,0.55),0_0_36px_10px_rgba(237,27,47,0.55)]"} transition-transform duration-200 ease-out motion-safe:group-hover:scale-105 motion-safe:group-active:scale-100`}>
        <CardHeader className="gap-3 text-primary-foreground">
          {/* Sticker telling this card is a promotion */}
          <span className="absolute top-3 right-3 z-10 rotate-6 rounded-xl border-3 border-foreground px-3 py-1 font-sans text-3xl font-bold uppercase tracking-wide shadow-[4px_4px_0_var(--foreground)] bg-background text-foreground [text-shadow:none]">
            Promo
          </span>
          <Badge
            variant={status}
            className="h-auto border-2 border-foreground px-2.5 py-0.5 font-sans text-xl font-bold uppercase tracking-wider"
          >
            {statusLabel}
          </Badge>
          <CardTitle className="break-words font-(family-name:--font-racing-sans) text-3xl leading-tight">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Badge
            variant={status}
            className="h-auto w-full justify-start whitespace-pre-line rounded-lg border-4 border-foreground px-3 py-1.5 text-2xl tracking-wide"
          >
            {when}
          </Badge>
          <div className="flex flex-col gap-1.5 rounded-lg border-4 border-foreground bg-secondary px-4 py-3 text-secondary-foreground">
            {restrictions.length > 0 ? (
              <ul className="flex list-disc flex-col gap-1 pl-5 text-2xl leading-snug">
                {restrictions.map((restriction) => (
                  <li key={restriction} className="break-words">{restriction}</li>
                ))}
              </ul>
            ) : (
              <p className="text-2xl leading-snug">No restrictions</p>
            )}
            <CardDescription className="break-words text-2xl text-secondary-foreground/85">
              {promotion.place ?? "Location TBA"}
            </CardDescription>
          </div>
        </CardContent>
      </Card>
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

export default PromotionCard;

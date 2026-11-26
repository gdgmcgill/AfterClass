// Shared expiry logic for every card that has a start and end date
// (events, promotions, ...).

// Something ending within this window shows as a warning (yellow).
const WARNING_WINDOW_MS = 24 * 60 * 60 * 1000;

// The values match the Badge variants, so the result can be passed straight to <Badge variant={...}>.
export type ExpiryStatus = "success" | "warning" | "error";

// Compares the end date with the current time.
// green (success) = still going, yellow (warning) = ends soon, red (error) = expired.
// Without an end date, it ends at 23:59 on its start date.
// Without either date, it ends at 23:59 today.
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

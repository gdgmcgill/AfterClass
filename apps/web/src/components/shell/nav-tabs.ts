import { Bookmark, CalendarDays, Compass, Map as MapIcon, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const TABS: readonly Tab[] = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/map", label: "Map", icon: MapIcon },
  { href: "/plan", label: "Plan", icon: CalendarDays },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/profile", label: "Profile", icon: User },
];

// A tab is active on its own page and on any page nested under it.
// "/" only matches exactly, otherwise Discover would be active everywhere.
export function isTabActive(pathname: string | null, href: string): boolean {
  if (pathname === null) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

import Link from "next/link";
import { cn } from "@/lib/utils";
import { TABS, isTabActive } from "./nav-tabs";

type TabListProps = {
  // Current URL path. null renders every tab as inactive (Suspense fallback).
  pathname: string | null;
};

export function TabList({ pathname }: TabListProps) {
  return (
    <ul className="mx-auto flex h-(--shell-nav-height)">
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive = isTabActive(pathname, href);
        return (
          <li key={href} className="flex-1">
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-full flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                isActive && "font-bold text-primary",
              )}
            >
              <Icon aria-hidden="true" className="size-6" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

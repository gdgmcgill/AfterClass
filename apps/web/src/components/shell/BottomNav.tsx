import { Suspense } from "react";
import { NavTabs } from "./NavTabs";
import { TabList } from "./TabList";

// Bottom navigation bar for the main areas of the app.
// With cacheComponents on, usePathname must sit inside Suspense. The fallback
// shows the same tabs without a highlight, so nothing shifts when it resolves.
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]"
    >
      <Suspense fallback={<TabList pathname={null} />}>
        <NavTabs />
      </Suspense>
    </nav>
  );
}

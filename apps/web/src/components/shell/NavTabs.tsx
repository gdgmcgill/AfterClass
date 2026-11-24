"use client";

import { usePathname } from "next/navigation";
import { TabList } from "./TabList";

// usePathname only works in Client Components, so this is the one client piece.
export function NavTabs() {
  return <TabList pathname={usePathname()} />;
}

// Bottom navigation bar for the main areas of the app. Tabs are added next.
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card"
    >
      <ul className="mx-auto flex h-(--shell-nav-height)" />
    </nav>
  );
}

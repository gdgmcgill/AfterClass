export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto flex h-(--shell-header-height) max-w-(--shell-content-max-width) items-center px-4">
        <span className="text-lg font-bold text-primary">AfterClass</span>
      </div>
    </header>
  );
}

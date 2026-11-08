export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">GDG McGill</p>
      <h1 className="text-5xl font-semibold tracking-tight">AfterClass</h1>
      <p className="text-lg text-slate-600">
        Discover activities and make plans together. The development environment is ready for
        the product teams to build on.
      </p>
      <nav className="flex gap-5 text-sm text-indigo-600" aria-label="Development checks">
        <a href="/api/health">Web health</a>
        <a href="/api/venues">Venues API</a>
        <a href="/api/ml/health">ML connection</a>
      </nav>
    </main>
  );
}

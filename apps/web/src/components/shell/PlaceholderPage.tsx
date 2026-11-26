type PlaceholderPageProps = {
  title: string;
};

// Empty page used by the three main tabs until their real content is built.
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    </section>
  );
}

export default function NotesAll() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <article
          key={i}
          className="rounded-xl border border-default bg-surface p-4 text-primary shadow-sm"
        >
          <div className="w-full rounded-lg bg-surface-muted mb-4 aspect-4/3" />
          <h3 className="font-medium">Not Başlığı {i}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Kısa açıklama veya içerikten özet...
          </p>
          <div className="mt-3 text-xs text-zinc-500">Son düzenleme: Bugün</div>
        </article>
      ))}
    </section>
  );
}

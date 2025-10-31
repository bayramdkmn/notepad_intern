export default function Favorites() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Favoriler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <article
            key={i}
            className="rounded-lg border bg-white dark:bg-zinc-900 p-4 text-zinc-900 dark:text-zinc-100"
          >
            <div className="w-full rounded-md bg-yellow-100 dark:bg-yellow-900/30 mb-4 aspect-4/3" />
            <h3 className="font-medium">Favori Not {i}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Kısa açıklama...
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

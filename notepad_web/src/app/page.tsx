export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] gap-0">
      {/* 56px ~ header yüksekliği */}
      {/* Sidebar */}
      <aside className="w-64 border-r bg-zinc-50 dark:bg-zinc-900 hidden md:flex md:flex-col">
        <div className="p-4 flex items-center gap-3 border-b">
          <div className="h-9 w-9 rounded-md bg-blue-600 text-white flex items-center justify-center">
            B
          </div>
          <div>
            <div className="font-semibold">Bilgi Sistemi</div>
            <div className="text-xs text-zinc-500">AI Destekli</div>
          </div>
        </div>
        <nav className="p-3 flex-1">
          <ul className="space-y-1 text-sm">
            <li>
              <a
                className="flex items-center gap-2 rounded px-3 py-2 bg-white dark:bg-zinc-800 border"
                href="#"
              >
                Tüm Notlar
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                href="#"
              >
                Favoriler
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                href="/tags"
              >
                Etiketler
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-2 rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                href="#"
              >
                Çöp Kutusu
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto p-4 border-t text-sm">
          <a
            className="flex items-center gap-2 hover:underline"
            href="/settings"
          >
            Ayarlar
          </a>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-zinc-300" />
            <div>
              <div className="text-sm font-medium">Kullanıcı Adı</div>
              <div className="text-xs text-zinc-500">Profil</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-semibold">Tüm Notlar</h1>
          <a
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2"
            href="#"
          >
            + Yeni Not Oluştur
          </a>
        </div>
        <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center">
          <input
            className="flex-1 rounded-md border px-4 py-2"
            placeholder="Anlam tabanlı arama yapın..."
          />
          <div className="flex gap-2">
            <button className="rounded-md border px-3 py-2 text-sm">
              Etikete Göre Filtrele
            </button>
            <button className="rounded-md border px-3 py-2 text-sm">
              Tarihe Göre Sırala
            </button>
            <button className="rounded-md border px-3 py-2 text-sm">
              İlgililik
            </button>
          </div>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <article
              key={i}
              className="rounded-lg border bg-white dark:bg-zinc-900 p-4"
            >
              <div className="h-40 w-full rounded-md bg-zinc-200 dark:bg-zinc-800 mb-4" />
              <h3 className="font-medium">Not Başlığı {i}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Kısa açıklama veya içerikten özet...
              </p>
              <div className="mt-3 text-xs text-zinc-500">
                Son düzenleme: Bugün
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left local sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-lg border bg-white dark:bg-zinc-900 p-3">
            <nav className="space-y-1 text-sm">
              <a
                className="block rounded px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                href="#"
              >
                Profil
              </a>
              <a
                className="block rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                href="#"
              >
                Güvenlik
              </a>
              <a
                className="block rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                href="#"
              >
                Bildirimler
              </a>
              <a
                className="block rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                href="#"
              >
                Tercihler
              </a>
              <a
                className="block rounded px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                href="#"
              >
                Hesap
              </a>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <section className="col-span-12 md:col-span-9">
          <h1 className="text-2xl font-semibold mb-4">Profil</h1>
          <div className="rounded-lg border bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-zinc-300" />
              <div>
                <div className="font-medium">Elif Aksoy</div>
                <div className="text-sm text-zinc-500">
                  elif.aksoy@eposta.com
                </div>
              </div>
              <div className="ml-auto">
                <button className="border rounded px-3 py-2 text-sm">
                  Resmi Değiştir
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500">Kullanıcı Adı</label>
                <input
                  className="mt-1 w-full border rounded px-3 py-2"
                  defaultValue="Elif Aksoy"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">E-posta Adresi</label>
                <input
                  className="mt-1 w-full border rounded px-3 py-2"
                  defaultValue="elif.aksoy@eposta.com"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="border rounded px-4 py-2">İptal</button>
              <button className="bg-blue-600 text-white rounded px-4 py-2">
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

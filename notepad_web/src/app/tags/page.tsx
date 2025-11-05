import Sidebar from "@/components/dashboard/Sidebar";

export default function TagsPage() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="text-2xl font-semibold mb-4">Etiket Yönetimi</h1>
        <form className="flex gap-2 mb-6">
          <input
            className="flex-1 border rounded px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
            placeholder="Yeni etiket adı"
          />
          <button
            className="rounded px-4 py-2 border hover:bg-gray-200 dark:hover:bg-zinc-800 cursor-pointer hover:scale-95 duration-400 ease-in-out transition-colors"
            type="submit"
          >
            Ekle
          </button>
        </form>
        <ul className="divide-y border rounded dark:border-zinc-700 dark:divide-zinc-700">
          <li className="flex items-center justify-between p-3 dark:bg-zinc-900">
            <span className="dark:text-white">#iş</span>
            <div className="flex gap-2">
              <button className="border rounded px-3 py-1 dark:border-zinc-600 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                Düzenle
              </button>
              <button className="border rounded px-3 py-1 dark:border-zinc-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                Sil
              </button>
            </div>
          </li>
          <li className="flex items-center justify-between p-3 dark:bg-zinc-900">
            <span className="dark:text-white">#kişisel</span>
            <div className="flex gap-2">
              <button className="border rounded px-3 py-1 dark:border-zinc-600 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                Düzenle
              </button>
              <button className="border rounded px-3 py-1 dark:border-zinc-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                Sil
              </button>
            </div>
          </li>
        </ul>
      </main>
    </div>
  );
}

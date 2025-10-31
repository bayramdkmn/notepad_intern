export default function TagsPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Etiket Yönetimi</h1>
      <form className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Yeni etiket adı"
        />
        <button className="bg-black text-white rounded px-4 py-2" type="submit">
          Ekle
        </button>
      </form>
      <ul className="divide-y border rounded">
        <li className="flex items-center justify-between p-3">
          <span>#iş</span>
          <div className="flex gap-2">
            <button className="border rounded px-3 py-1">Düzenle</button>
            <button className="border rounded px-3 py-1">Sil</button>
          </div>
        </li>
        <li className="flex items-center justify-between p-3">
          <span>#kişisel</span>
          <div className="flex gap-2">
            <button className="border rounded px-3 py-1">Düzenle</button>
            <button className="border rounded px-3 py-1">Sil</button>
          </div>
        </li>
      </ul>
    </main>
  );
}

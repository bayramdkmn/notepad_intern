export default function ProfilePanel() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6">Profil</h2>
      <div className="rounded-lg border p-6 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-zinc-300" />
          <div>
            <div className="font-medium">Kullanıcı Adı</div>
            <div className="text-sm text-zinc-500">kullanici@eposta.com</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Kullanıcı Adı"
          />
          <input className="border rounded px-3 py-2" placeholder="E-posta" />
        </div>
        <div className="mt-4 flex gap-2">
          <button className="border rounded px-4 py-2">İptal</button>
          <button className="bg-blue-600 text-white rounded px-4 py-2">
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Arama</h1>
      <form className="mb-6">
        <input
          className="w-full border rounded px-4 py-2"
          placeholder="Notlarda anlam tabanlı ara..."
        />
      </form>
      <div className="space-y-3">
        <div className="border rounded p-4">
          <h3 className="font-medium">Sonuç Başlığı</h3>
          <p className="text-sm text-gray-600">
            İçerikten kısa bir önizleme...
          </p>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-medium">Başka Bir Not</h3>
          <p className="text-sm text-gray-600">
            Modelin bulduğu ilgili kısım...
          </p>
        </div>
      </div>
    </main>
  );
}

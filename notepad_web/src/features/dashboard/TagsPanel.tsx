export default function TagsPanel() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Etiketler</h2>
      <form className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Etiketlerde ara"
        />
        <button className="border rounded px-3 py-2" type="button">
          Filtre
        </button>
        <button
          className="bg-blue-600 text-white rounded px-4 py-2"
          type="button"
        >
          Yeni Etiket Oluştur
        </button>
      </form>
      <div className="rounded-lg border">
        <div className="grid grid-cols-12 gap-2 p-3 text-xs text-zinc-500">
          <div className="col-span-4">ETİKET ADI</div>
          <div className="col-span-3">NOT SAYISI</div>
          <div className="col-span-3">OLUŞTURULMA TARİHİ</div>
          <div className="col-span-2 text-right">EYLEMLER</div>
        </div>
        {["İş", "Kişisel", "Proje X", "Fikirler", "Toplantı"].map(
          (name, idx) => (
            <div
              key={name}
              className="grid grid-cols-12 gap-2 items-center p-3 border-t"
            >
              <div className="col-span-4 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    idx % 2 ? "bg-yellow-400" : "bg-blue-500"
                  }`}
                ></span>
                {name}
              </div>
              <div className="col-span-3">{(idx + 1) * 5} not</div>
              <div className="col-span-3">15.08.2023</div>
              <div className="col-span-2 flex justify-end gap-2 text-sm">
                <button className="border rounded px-2 py-1">Düzenle</button>
                <button className="border rounded px-2 py-1">Sil</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

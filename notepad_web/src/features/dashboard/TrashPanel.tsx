export default function TrashPanel() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Çöp Kutusu</h2>
      <div className="rounded-lg border divide-y">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3">
            <div>
              <div className="font-medium">Silinmiş Not {i}</div>
              <div className="text-xs text-zinc-500">Silinme: 2 gün önce</div>
            </div>
            <div className="flex gap-2 text-sm">
              <button className="border rounded px-2 py-1">Geri Yükle</button>
              <button className="border rounded px-2 py-1">Kalıcı Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

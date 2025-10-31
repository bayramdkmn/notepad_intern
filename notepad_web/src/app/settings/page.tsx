import Sidebar from "@/components/dashboard/Sidebar";
import ContrastIcon from "@mui/icons-material/Contrast";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="text-2xl font-semibold mb-4">Ayarlar</h1>
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="border rounded px-3 py-2" placeholder="Ad" />
              <input className="border rounded px-3 py-2" placeholder="Soyad" />
              <input
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="E-posta"
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-2">Tema</h2>
            <ContrastIcon fontSize="large" />
            <div className="flex items-center gap-3">
              <button className="border rounded px-3 py-2">Açık</button>
              <button className="border rounded px-3 py-2">Koyu</button>
              <button className="border rounded px-3 py-2">Sistem</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

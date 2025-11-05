import Sidebar from "@/components/dashboard/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="text-2xl font-semibold mb-4">Ayarlar</h1>
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Tema</h2>
            <div className="flex items-center gap-3 p-4 border rounded-lg dark:border-zinc-700">
              <ThemeToggle />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

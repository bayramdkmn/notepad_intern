import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold mb-4 animate-slide-in-top">
        Ayarlar
      </h1>
      <section className="space-y-6 animate-scale-in">
        <div>
          <h2 className="text-lg font-medium mb-2">Tema</h2>
          <div className="flex items-center gap-3 p-4 border rounded-lg dark:border-zinc-700 transition-transform">
            <ThemeToggle />
          </div>
        </div>
      </section>
    </div>
  );
}

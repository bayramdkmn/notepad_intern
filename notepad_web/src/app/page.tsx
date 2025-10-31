"use client";

import { useSearchParams } from "next/navigation";
import NotesAll from "@/features/dashboard/NotesAll";
import Favorites from "@/features/dashboard/Favorites";
import TagsPanel from "@/features/dashboard/TagsPanel";
import TrashPanel from "@/features/dashboard/TrashPanel";
import ThemeToggle from "@/components/ThemeToggle";
// profile panel artık ayrı sayfada

export default function Home() {
  const params = useSearchParams();
  const section = params.get("section") || "all";
  return (
    <div className="flex min-h-screen gap-0 bg-[var(--background)] text-[var(--color-text-primary)]">
      <aside className="basis-[22%] lg:basis-[20%] xl:basis-[18%] border-r border-default bg-surface text-primary hidden md:flex md:flex-col sticky top-0 self-start min-h-screen overflow-y-auto">
        <div className="p-4 flex items-center gap-3 border-b">
          <div className="rounded-md bg-blue-600/90 text-white flex items-center justify-center px-2 py-1">
            B
          </div>
          <div>
            <div className="font-semibold">Bilgi Sistemi</div>
            <div className="text-xs text-zinc-500">AI Destekli</div>
          </div>
        </div>
        <nav className="p-3 flex-1">
          <ul className="space-y-1 text-sm">
            <li>
              <a
                className={`flex items-center gap-2 rounded px-3 py-2 ${
                  section === "all"
                    ? "bg-white dark:bg-zinc-800 border"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                href="/?section=all"
              >
                Tüm Notlar
              </a>
            </li>
            <li>
              <a
                className={`flex items-center gap-2 rounded px-3 py-2 ${
                  section === "favorites"
                    ? "bg-white dark:bg-zinc-800 border"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                href="/?section=favorites"
              >
                Favoriler
              </a>
            </li>
            <li>
              <a
                className={`flex items-center gap-2 rounded px-3 py-2 ${
                  section === "tags"
                    ? "bg-white dark:bg-zinc-800 border"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                href="/?section=tags"
              >
                Etiketler
              </a>
            </li>
            <li>
              <a
                className={`flex items-center gap-2 rounded px-3 py-2 ${
                  section === "trash"
                    ? "bg-white dark:bg-zinc-800 border"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                href="/?section=trash"
              >
                Çöp Kutusu
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto p-4 border-t text-sm">
          <a href="/profile" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-zinc-300" />
            <div>
              <div className="text-sm font-medium">Kullanıcı Adı</div>
              <div className="text-xs text-zinc-500">Profil</div>
            </div>
          </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-surface">
        {/* Local topbar: header artık içerikte, sidebar ile çakışmaz */}
        <header className="w-full border-b border-default bg-surface">
          <nav className="w-full px-[3%] py-3 flex items-center gap-4 text-primary">
            <a href="/" className="font-semibold">
              Notepad AI
            </a>
            <div className="flex items-center gap-3 text-sm">
              <a href="/search" className="underline-offset-4 hover:underline">
                Arama
              </a>
              <a href="/tags" className="underline-offset-4 hover:underline">
                Etiketler
              </a>
              <a
                href="/settings"
                className="underline-offset-4 hover:underline"
              >
                Ayarlar
              </a>
            </div>
            <div className="ml-auto flex items-center gap-2 text-sm">
              <ThemeToggle />
              <a href="/login" className="border rounded px-3 py-1">
                Giriş
              </a>
              <a
                href="/register"
                className="bg-black text-white rounded px-3 py-1"
              >
                Kayıt ol
              </a>
            </div>
          </nav>
        </header>

        <div className="px-[3%] py-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-primary">Tüm Notlar</h1>
          <a
            className="inline-flex items-center gap-2 rounded-md btn-accent px-4 py-2"
            href="#"
          >
            + Yeni Not Oluştur
          </a>
        </div>
        <div className="px-[3%] flex flex-col gap-3 mb-4 md:flex-row md:items-center">
          <input
            className="flex-1 rounded-md border border-default px-4 py-2 bg-surface text-primary placeholder-zinc-500"
            placeholder="Anlam tabanlı arama yapın..."
          />
          <div className="flex gap-2">
            <button className="rounded-md border border-default px-3 py-2 text-sm bg-surface text-primary">
              Etikete Göre Filtrele
            </button>
            <button className="rounded-md border border-default px-3 py-2 text-sm bg-surface text-primary">
              Tarihe Göre Sırala
            </button>
            <button className="rounded-md border border-default px-3 py-2 text-sm bg-surface text-primary">
              İlgililik
            </button>
          </div>
        </div>
        <div className="px-[3%] pb-8">
          {section === "all" && <NotesAll />}
          {section === "favorites" && <Favorites />}
          {section === "tags" && <TagsPanel />}
          {section === "trash" && <TrashPanel />}
        </div>
        {/* profil ayrı route */}
      </main>
    </div>
  );
}

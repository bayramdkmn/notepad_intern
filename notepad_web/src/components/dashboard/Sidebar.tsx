"use client";

import { usePathname } from "next/navigation";
import PsychologyIcon from "@mui/icons-material/Psychology";
import NotesIcon from "@mui/icons-material/Notes";
import TagIcon from "@mui/icons-material/Tag";
import SettingsIcon from "@mui/icons-material/Settings";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

export default function Sidebar() {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Notlar" },
    { href: "/tags", label: "Etiketler" },
    { href: "/settings", label: "Ayarlar" },
  ];
  return (
    <aside className="hidden md:flex w-full md:w-1/4 lg:w-1/5 xl:w-1/6 flex-col sticky top-0 self-start min-h-screen bg-white p-2 text-gray-800 border-r border-gray-300 dark:bg-[#1A1A1A] dark:text-[#E0E0E0] dark:border-[#424242]">
      <div className="flex flex-col gap-8">
        <div className="flex gap-3 items-center px-2">
          <div className="rounded-lg size-10 flex items-center justify-center bg-primary/10">
            <PsychologyIcon
              className="text-primary dark:text-white"
              fontSize="medium"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 text-base font-bold leading-normal dark:text-white">
              Brain AI
            </h1>
          </div>
        </div>
        <nav className="flex flex-col gap-2 px-1">
          {items.map((it) => {
            const active =
              pathname === it.href ||
              (it.href !== "/" && pathname.startsWith(it.href));
            const base =
              "relative group overflow-hidden flex items-center gap-3 px-4 py-2 rounded-lg  transition-all duration-300 ease-out";
            const cls = active
              ? `${base} bg-gray-300 text-primary dark:bg-white/10 dark:text-white`
              : `${base} hover:bg-gray-200 text-gray-700 dark:text-[#E0E0E0] dark:hover:bg-white/10`;
            return (
              <a key={it.href} className={cls} href={it.href}>
                {it.href === "/" && <NotesIcon fontSize="small" />}
                {it.href === "/tags" && <TagIcon fontSize="small" />}
                {it.href === "/settings" && <SettingsIcon fontSize="small" />}
                <p className="text-sm font-medium leading-normal">{it.label}</p>
                {/* Top edge */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-0 h-0.5 w-full bg-neutral-600 origin-left transition-transform duration-500 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
                {/* Right edge */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute right-0 top-0 w-0.5 h-full bg-neutral-600 origin-top transition-transform duration-500 delay-150 ${
                    active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                  }`}
                />
                {/* Bottom edge */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-0 bottom-0 h-0.5 w-full bg-neutral-600 origin-right transition-transform duration-500 delay-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
                {/* Left edge */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-0 w-0.5 h-full bg-neutral-600 origin-bottom transition-transform duration-500 delay-450 ${
                    active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto flex flex-col gap-3 border-t border-gray-300 pt-4 dark:border-[#424242]">
        <button className="flex items-center justify-center gap-2 py-3 hover:scale-95 duration-300 px-6 w-full shrink-0 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all">
          <NoteAddIcon fontSize="small" />
          <span>Yeni Not Oluştur</span>
        </button>
        <a
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
          href="#"
        >
          <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center dark:bg-zinc-600"></div>
          <div className="flex flex-col">
            <p className="text-gray-500 text-xs font-normal">Profil Ayarları</p>
          </div>
        </a>
      </div>
    </aside>
  );
}

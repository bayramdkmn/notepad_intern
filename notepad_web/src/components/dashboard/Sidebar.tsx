"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import PsychologyIcon from "@mui/icons-material/Psychology";
import NotesIcon from "@mui/icons-material/Notes";
import TagIcon from "@mui/icons-material/Tag";
import SettingsIcon from "@mui/icons-material/Settings";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "@/providers/AuthProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // User display bilgilerini memo ile cache'le
  const userDisplay = useMemo(() => {
    if (!mounted || isLoading) {
      return {
        avatar: "",
        name: "",
        email: "",
      };
    }

    if (user?.name) {
      const initials = user.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return {
        avatar: initials,
        name: user.name,
        email: user.email,
      };
    }

    return {
      avatar: "",
      name: "",
      email: "",
    };
  }, [user, mounted, isLoading]);

  const items = [
    { href: "/", label: "Notlar" },
    { href: "/tags", label: "Etiketler" },
    { href: "/settings", label: "Ayarlar" },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-3 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700"
      >
        <MenuIcon className="text-gray-900 dark:text-white" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 w-3/4 max-w-sm h-full bg-white dark:bg-[#1A1A1A] p-2 text-gray-800 dark:text-[#E0E0E0] shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
        >
          <CloseIcon />
        </button>
        <div className="flex flex-col gap-8 mt-8">
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
                "relative group overflow-hidden flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ease-out";
              const cls = active
                ? `${base} bg-gray-300 text-primary dark:bg-white/10 dark:text-white`
                : `${base} hover:bg-gray-200 text-gray-700 dark:text-[#E0E0E0] dark:hover:bg-white/10`;
              return (
                <a
                  key={it.href}
                  className={cls}
                  href={it.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {it.href === "/" && <NotesIcon fontSize="small" />}
                  {it.href === "/tags" && <TagIcon fontSize="small" />}
                  {it.href === "/settings" && <SettingsIcon fontSize="small" />}
                  <p className="text-sm font-medium leading-normal">
                    {it.label}
                  </p>
                </a>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto flex flex-col gap-3 border-t border-gray-300 pt-4 dark:border-[#424242]">
          <button
            onClick={() => {
              router.push("/notes/new");
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center justify-center gap-2 py-3 px-6 w-full bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90"
          >
            <NoteAddIcon fontSize="small" />
            <span>Yeni Not Oluştur</span>
          </button>
          <a
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
          >
            {userDisplay.avatar ? (
              <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {userDisplay.avatar}
              </div>
            ) : (
              <div className="size-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
            )}
            <div className="flex flex-col flex-1 min-w-0">
              {userDisplay.name ? (
                <>
                  <p className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    {userDisplay.name}
                  </p>
                  <p className="text-gray-500 text-xs font-normal truncate">
                    {userDisplay.email}
                  </p>
                </>
              ) : (
                <>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32 mt-1 animate-pulse" />
                </>
              )}
            </div>
          </a>
        </div>
      </aside>

      {/* Desktop Sidebar */}
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
                  <p className="text-sm font-medium leading-normal">
                    {it.label}
                  </p>
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute left-0 top-0 h-0.5 w-full bg-neutral-600 origin-left transition-transform duration-500 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute right-0 top-0 w-0.5 h-full bg-neutral-600 origin-top transition-transform duration-500 delay-150 ${
                      active
                        ? "scale-y-100"
                        : "scale-y-0 group-hover:scale-y-100"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute left-0 bottom-0 h-0.5 w-full bg-neutral-600 origin-right transition-transform duration-500 delay-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute left-0 top-0 w-0.5 h-full bg-neutral-600 origin-bottom transition-transform duration-500 delay-450 ${
                      active
                        ? "scale-y-100"
                        : "scale-y-0 group-hover:scale-y-100"
                    }`}
                  />
                </a>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto flex flex-col gap-3 border-t border-gray-300 pt-4 dark:border-[#424242]">
          <button
            onClick={() => router.push("/notes/new")}
            className="flex items-center justify-center gap-2 py-3 hover:scale-95 duration-300 px-6 w-full shrink-0 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all"
          >
            <NoteAddIcon fontSize="small" />
            <span>Yeni Not Oluştur</span>
          </button>
          <a
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {userDisplay.avatar ? (
              <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {userDisplay.avatar}
              </div>
            ) : (
              <div className="size-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
            )}
            <div className="flex flex-col flex-1 min-w-0">
              {userDisplay.name ? (
                <>
                  <p className="text-gray-900 dark:text-white text-sm font-medium truncate">
                    {userDisplay.name}
                  </p>
                  <p className="text-gray-500 text-xs font-normal truncate">
                    {userDisplay.email}
                  </p>
                </>
              ) : (
                <>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32 mt-1 animate-pulse" />
                </>
              )}
            </div>
          </a>
        </div>
      </aside>
    </>
  );
}

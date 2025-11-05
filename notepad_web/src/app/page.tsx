"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import SearchBar from "@/components/dashboard/SearchBar";
import NotesGrid from "@/components/dashboard/NotesGrid";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <SearchBar />
          <div className="flex flex-wrap justify-between gap-3 mb-6">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-gray-900 text-3xl font-bold tracking-tight dark:text-white">
                Notlarım
              </h1>
              <p className="text-gray-600 text-base font-normal leading-normal dark:text-gray-300">
                Tüm notlarınıza buradan erişebilir ve yönetebilirsiniz.
              </p>
            </div>
          </div>
          <NotesGrid />
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import SearchBar from "@/components/dashboard/SearchBar";
import NotesGrid from "@/components/dashboard/NotesGrid";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    console.log("handleSearch called with:", query);
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    console.log("handleClearSearch called");
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
        <div className="max-w-7xl mx-auto mt-14 sm:mt-0">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h1 className="text-gray-900 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight dark:text-white">
                Notlarım
              </h1>
              <p className="text-gray-600 text-sm sm:text-base font-normal leading-normal dark:text-gray-300">
                Tüm notlarınıza buradan erişebilir ve yönetebilirsiniz.
              </p>
            </div>
          </div>
          <NotesGrid searchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
}

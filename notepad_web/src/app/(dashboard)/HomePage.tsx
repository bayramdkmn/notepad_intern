"use client";

import { useState } from "react";
import SearchBar from "@/components/dashboard/SearchBar";
import NotesGrid from "@/components/dashboard/NotesGrid";
import type { Note } from "@/types";

interface HomePageProps {
  initialNotes: Note[];
}

export default function HomePage({ initialNotes }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto mt-14 sm:mt-0">
      <div className="animate-slide-in-top">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 animate-slide-in-left">
        <div className="flex flex-col gap-1 sm:gap-2">
          <h1 className="text-gray-900 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight dark:text-white">
            Notlarım
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-normal leading-normal dark:text-gray-300">
            Tüm notlarınıza buradan erişebilir ve yönetebilirsiniz.
          </p>
        </div>
      </div>
      <div className="animate-slide-in-bottom">
        <NotesGrid searchQuery={searchQuery} initialNotes={initialNotes} />
      </div>
    </div>
  );
}

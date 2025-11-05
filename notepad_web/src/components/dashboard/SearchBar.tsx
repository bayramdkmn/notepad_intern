"use client";

import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

interface SearchBarProps {
  onSearch: (query: string) => void | Promise<void>;
  onClear: () => void;
}

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search - 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        onSearch(searchQuery);
      } else if (searchQuery === "") {
        onClear();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, onClear]);

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
      <div className="w-full flex-1">
        <label className="flex flex-col w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-10 sm:h-12 bg-white border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:bg-[#242424] dark:border-zinc-700 dark:focus-within:border-blue-500 transition-all">
            <div className="pl-3 sm:pl-4 flex items-center text-gray-400">
              <SearchIcon fontSize="small" />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-800 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 px-3 text-sm sm:text-base font-normal leading-normal dark:text-[#E0E0E0]"
              placeholder="Anlam tabanlı arama yapın..."
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2 sm:px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-r-lg"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>
        </label>
      </div>
    </header>
  );
}

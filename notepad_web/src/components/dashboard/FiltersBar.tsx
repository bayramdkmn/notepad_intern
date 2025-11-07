"use client";

import { useState, useEffect } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventNoteIcon from "@mui/icons-material/EventNote";
export interface FilterOptions {
  tags: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
  timeRange: "all" | "today" | "week" | "month" | "year";
  showFutureNotesOnly: boolean;
}

export type SortOption = "date-desc" | "date-asc" | "priority" | "title";

interface FiltersBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOption) => void;
  availableTags: string[];
  currentSort: SortOption;
}

export default function FiltersBar({
  onFilterChange,
  onSortChange,
  availableTags,
  currentSort,
}: FiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<FilterOptions["timeRange"]>("all");
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [showFutureNotes, setShowFutureNotes] = useState(false);

  useEffect(() => {
    onFilterChange({
      tags: selectedTags,
      dateRange: {
        start: customDateStart || null,
        end: customDateEnd || null,
      },
      timeRange,
      showFutureNotesOnly: showFutureNotes,
    });
  }, [
    selectedTags,
    timeRange,
    customDateStart,
    customDateEnd,
    showFutureNotes,
  ]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setTimeRange("all");
    setCustomDateStart("");
    setCustomDateEnd("");
    setShowFutureNotes(false);
  };

  const hasActiveFilters =
    selectedTags.length > 0 ||
    timeRange !== "all" ||
    customDateStart ||
    customDateEnd ||
    showFutureNotes;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Filter & Sort Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="relative flex-1 sm:flex-initial min-w-0">
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-8 sm:pr-10 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date-desc">En Yeni</option>
            <option value="date-asc">En Eski</option>
            <option value="priority">Öncelik</option>
            <option value="title">A-Z</option>
          </select>
          <SortIcon className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
          }`}
        >
          <FilterListIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Filtrele</span>
          {hasActiveFilters && (
            <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {selectedTags.length +
                (timeRange !== "all" ? 1 : 0) +
                (showFutureNotes ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Show Just Future Notes */}
        <button
          onClick={() => setShowFutureNotes(!showFutureNotes)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            showFutureNotes
              ? "bg-blue-500 text-white shadow-lg shadow-purple-500/30"
              : "bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
          }`}
        >
          <EventNoteIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">İleri Tarihli</span>
          <span className="sm:hidden">İleri Tarih</span>
        </button>
        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <CloseIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Temizle</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg sm:rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 animate-in slide-in-from-top-2">
          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <LocalOfferIcon className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  Etiketler
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    if (selectedTags.length === availableTags.length) {
                      setSelectedTags([]);
                    } else {
                      setSelectedTags(availableTags);
                    }
                  }}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    selectedTags.length === availableTags.length
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
                  }`}
                >
                  Tümünü Seç
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Range Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <CalendarTodayIcon className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                Zaman Aralığı
              </h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {[
                { value: "all", label: "Tümü" },
                { value: "today", label: "Bugün" },
                { value: "week", label: "Hafta" },
                { value: "month", label: "Ay" },
                { value: "year", label: "Yıl" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setTimeRange(option.value as FilterOptions["timeRange"])
                  }
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    timeRange === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Başlangıç
                </label>
                <input
                  type="date"
                  value={customDateStart}
                  onChange={(e) => {
                    setCustomDateStart(e.target.value);
                    setTimeRange("all");
                  }}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Bitiş
                </label>
                <input
                  type="date"
                  value={customDateEnd}
                  onChange={(e) => {
                    setCustomDateEnd(e.target.value);
                    setTimeRange("all");
                  }}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

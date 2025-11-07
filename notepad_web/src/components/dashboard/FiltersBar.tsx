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
  showPinnedOnly: boolean;
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
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    onFilterChange({
      tags: selectedTags,
      dateRange: {
        start: customDateStart || null,
        end: customDateEnd || null,
      },
      timeRange,
      showFutureNotesOnly: showFutureNotes,
      showPinnedOnly,
    });
  }, [
    selectedTags,
    timeRange,
    customDateStart,
    customDateEnd,
    showFutureNotes,
    showPinnedOnly,
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
    setShowPinnedOnly(false);
  };

  const hasActiveFilters =
    selectedTags.length > 0 ||
    timeRange !== "all" ||
    customDateStart ||
    customDateEnd ||
    showFutureNotes ||
    showPinnedOnly;

  const getSortLabel = (sort: SortOption) => {
    const labels = {
      "date-desc": "En Yeni",
      "date-asc": "En Eski",
      priority: "Öncelik",
      title: "A-Z",
    };
    return labels[sort];
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Filter & Sort Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Sort Dropdown */}
        <div className="relative flex-1 sm:flex-initial min-w-0">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span>Sıralama</span>
            <SortIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </button>

          {showSortMenu && (
            <div className="absolute z-10 mt-2 w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  onSortChange("date-desc");
                  setShowSortMenu(false);
                }}
                className={`w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${
                  currentSort === "date-desc"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                En Yeni
              </button>
              <button
                onClick={() => {
                  onSortChange("date-asc");
                  setShowSortMenu(false);
                }}
                className={`w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${
                  currentSort === "date-asc"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                En Eski
              </button>
              <button
                onClick={() => {
                  onSortChange("priority");
                  setShowSortMenu(false);
                }}
                className={`w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${
                  currentSort === "priority"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Öncelik
              </button>
              <button
                onClick={() => {
                  onSortChange("title");
                  setShowSortMenu(false);
                }}
                className={`w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 ${
                  currentSort === "title"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                A-Z
              </button>
            </div>
          )}
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
                (showFutureNotes ? 1 : 0) +
                (showPinnedOnly ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Show Just Future Notes */}
        <button
          onClick={() => setShowFutureNotes(!showFutureNotes)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            showFutureNotes
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
              : "bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
          }`}
        >
          <EventNoteIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">İleri Tarihli</span>
          <span className="sm:hidden">İleri Tarih</span>
        </button>

        {/* Show Pinned Only */}
        <button
          onClick={() => setShowPinnedOnly(!showPinnedOnly)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            showPinnedOnly
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
              : "bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
          <span className="hidden sm:inline">İşaretlenmiş</span>
          <span className="sm:hidden">İşaretli</span>
        </button>
      </div>

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

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="pt-2 sm:pt-4 border-t border-gray-200 dark:border-zinc-700">
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <CloseIcon className="w-4 h-4" />
                <span>Tüm Filtreleri Temizle</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

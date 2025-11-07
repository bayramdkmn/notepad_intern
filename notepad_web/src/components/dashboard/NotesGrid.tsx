"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import NoteModal from "@/components/dashboard/NoteModal";
import FiltersBar, {
  FilterOptions,
  SortOption,
} from "@/components/dashboard/FiltersBar";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { api } from "@/lib/api";

interface Tag {
  id: number;
  name: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  is_pinned?: boolean;
  is_favorite?: boolean;
  is_feature_note?: boolean;
  feature_date?: string | null;
}

interface NotesGridProps {
  searchQuery?: string;
}

export default function NotesGrid({ searchQuery = "" }: NotesGridProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchResults, setSearchResults] = useState<Note[] | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    tags: [],
    dateRange: { start: null, end: null },
    timeRange: "all",
    showFutureNotesOnly: false,
  });
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    console.log("useEffect - searchQuery changed:", searchQuery);
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      performSearch(searchQuery);
    } else {
      console.log("Clearing search results");
      setSearchResults(null);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    try {
      console.log("API call - searchNotes with query:", query);
      const results = await api.searchNotes(query);
      console.log("Search results:", results);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const results = await api.searchNotes(query);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((note) => {
      note.tags?.forEach((tag) => tags.add(tag.name));
    });
    return Array.from(tags);
  }, [notes]);

  // Apply filters and sorting
  const filteredAndSortedNotes = useMemo(() => {
    console.log("useMemo - searchResults:", searchResults);
    console.log("useMemo - notes:", notes.length);

    // If search results exist, use them instead of all notes
    let filtered = searchResults !== null ? [...searchResults] : [...notes];
    console.log("useMemo - filtered after search check:", filtered.length);

    // Filter by future notes only (if enabled)
    if (filters.showFutureNotesOnly) {
      const now = new Date();
      filtered = filtered.filter((note) => {
        // İleri tarihli olarak işaretlenmiş VE feature_date gelecekte olan notlar
        if (note.is_feature_note && note.feature_date) {
          const featureDate = new Date(note.feature_date);
          return featureDate > now;
        }
        return false;
      });
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter((note) =>
        note.tags?.some((tag) => filters.tags.includes(tag.name))
      );
    }

    // Filter by time range (only if not showing future notes)
    const now = new Date();
    if (filters.timeRange !== "all" && !filters.showFutureNotesOnly) {
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.updated_at);
        const diffMs = now.getTime() - noteDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        switch (filters.timeRange) {
          case "today":
            return diffDays < 1;
          case "week":
            return diffDays < 7;
          case "month":
            return diffDays < 30;
          case "year":
            return diffDays < 365;
          default:
            return true;
        }
      });
    }

    // Filter by custom date range
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.updated_at);
        const start = filters.dateRange.start
          ? new Date(filters.dateRange.start)
          : null;
        const end = filters.dateRange.end
          ? new Date(filters.dateRange.end)
          : null;

        if (start && end) {
          return noteDate >= start && noteDate <= end;
        } else if (start) {
          return noteDate >= start;
        } else if (end) {
          return noteDate <= end;
        }
        return true;
      });
    }

    // Apply sorting
    const sorted = [...filtered];

    // If we have search results, sort by similarity score first
    if (searchResults !== null) {
      sorted.sort((a: any, b: any) => {
        const scoreA = a.similarity || 0;
        const scoreB = b.similarity || 0;
        return scoreB - scoreA; // Higher similarity first
      });
    } else {
      // Normal sorting when no search
      switch (sortOption) {
        case "date-desc":
          sorted.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );
          break;
        case "date-asc":
          sorted.sort(
            (a, b) =>
              new Date(a.updated_at).getTime() -
              new Date(b.updated_at).getTime()
          );
          break;
        case "priority":
          sorted.sort((a, b) => {
            // Pinned notes first, then favorites
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            if (a.is_favorite && !b.is_favorite) return -1;
            if (!a.is_favorite && b.is_favorite) return 1;
            return 0;
          });
          break;
        case "title":
          sorted.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
    }

    return sorted;
  }, [notes, searchResults, filters, sortOption]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getNotes();
      // Eğer backend boş array dönerse, hata değil boş durum
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      // Boş notlar durumunu hata olarak gösterme
      const errorMessage =
        err instanceof Error ? err.message : "Notlar yüklenemedi";
      if (
        errorMessage.toLowerCase().includes("empty") ||
        errorMessage.toLowerCase().includes("database")
      ) {
        setNotes([]);
      } else {
        console.error("Failed to fetch notes:", err);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string, isFutureNote?: boolean) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime(); // İleri tarih için pozitif olacak
    const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    // İleri tarihli notlar için
    if (isFutureNote && diffMs > 0) {
      if (diffSeconds < 60) return "Az sonra";
      if (diffMinutes < 60) return `${diffMinutes} dakika sonra`;
      if (diffHours < 24) return `${diffHours} saat sonra`;
      if (diffDays === 1) return "Yarın";
      if (diffDays < 7) return `${diffDays} gün sonra`;
      if (diffWeeks < 4) return `${diffWeeks} hafta sonra`;
      if (diffMonths < 12) return `${diffMonths} ay sonra`;
      return `${Math.floor(diffMonths / 12)} yıl sonra`;
    }

    // Geçmiş tarihler için (normal notlar)
    if (diffSeconds < 60) return "Az önce";
    if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffWeeks < 4) return `${diffWeeks} hafta önce`;
    if (diffMonths < 12) return `${diffMonths} ay önce`;
    return `${Math.floor(diffMonths / 12)} yıl önce`;
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchNotes}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  const hasActiveFilters =
    searchResults !== null ||
    filters.tags.length > 0 ||
    filters.timeRange !== "all" ||
    filters.dateRange.start ||
    filters.dateRange.end;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters & Sort Bar */}
      <FiltersBar
        onFilterChange={setFilters}
        onSortChange={setSortOption}
        availableTags={allTags}
        currentSort={sortOption}
      />

      {/* Create New Note Card - Always on top */}
      <div
        onClick={() => router.push("/notes/new")}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg sm:rounded-xl p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-blue-600 rounded-full group-hover:scale-110 transition-transform">
            <NoteAddIcon className="text-white" fontSize="medium" />
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
              Yeni Not Oluştur
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Fikirlerinizi hemen kaydedin
            </p>
          </div>
          <div className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAndSortedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl dark:bg-zinc-800/40 dark:border-zinc-700">
            <NoteAddIcon
              fontSize="large"
              className="mb-3 sm:mb-4 text-gray-400"
            />
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 dark:text-white">
              {searchResults !== null
                ? "Arama sonucu bulunamadı"
                : hasActiveFilters
                ? "Filtre sonucu not bulunamadı"
                : "Henüz not yok"}
            </h3>
            <p className="text-gray-500 max-w-xs text-xs sm:text-sm mb-3 sm:mb-4 px-4">
              {searchResults !== null
                ? "Farklı anahtar kelimeler deneyin."
                : hasActiveFilters
                ? "Farklı filtreler deneyin veya yeni not oluşturun."
                : "İlk notunuzu oluşturarak başlayın."}
            </p>
            <button
              onClick={() => router.push("/notes/new")}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Yeni Not Oluştur
            </button>
          </div>
        ) : (
          <>
            {filteredAndSortedNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`bg-white dark:bg-zinc-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border transition-all cursor-pointer group relative ${
                  note.is_feature_note && note.feature_date
                    ? "border-slate-300 dark:border-slate-600 hover:shadow-lg hover:shadow-slate-400/10 hover:border-slate-400 dark:hover:border-slate-500"
                    : "border-gray-200 dark:border-zinc-700 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500"
                }`}
              >
                <div className="flex  justify-between h-full gap-3 sm:gap-4">
                  {/* Future Note Indicator on Left */}
                  {note.is_feature_note && note.feature_date && (
                    <div className="flex-shrink-0 pt-1">
                      <div className="w-1 h-full min-h-[60px] bg-gradient-to-b from-slate-400 to-slate-500 rounded-full shadow-sm shadow-slate-400/20"></div>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate sm:whitespace-normal">
                        {note.title}
                      </h3>
                      {note.is_feature_note && note.feature_date && (
                        <span className="flex-shrink-0 text-slate-700 dark:text-slate-300 text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 rounded">
                          İLERİ TARİHLİ
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3 sm:mb-4">
                      {note.content}
                    </p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {note.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-500/20 dark:text-blue-300"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs sm:text-sm flex-shrink-0">
                    {note.is_feature_note && note.feature_date ? (
                      <div className="space-y-1 flex items-end flex-col gap-2">
                        <div className="flex flex-row items-center gap-1.5 w-min px-2 sm:px-3 py-1 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/30 border-2 border-slate-300 dark:border-slate-600 rounded-full shadow-sm shadow-slate-200/30 dark:shadow-slate-900/20">
                          <svg
                            className="w-3 h-3 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {formatFullDate(note.feature_date)}
                          </span>
                        </div>

                        <div className="text-slate-600 dark:text-slate-400 text-xs">
                          Kalan Süre: {formatDate(note.feature_date, true)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Oluşturulma Tarihi: {formatFullDate(note.updated_at)}{" "}
                          ({formatDate(note.created_at, false)})
                        </div>
                        {/* <div className="text-gray-500 dark:text-gray-500 text-[10px] pt-1 border-t border-slate-200 dark:border-slate-700">
                          Oluşturuldu: {formatDate(note.created_at, false)}
                        </div> */}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Oluşturulma Tarihi: {formatFullDate(note.updated_at)}{" "}
                          ({formatDate(note.created_at, false)})
                        </div>
                        {/* <div className="text-gray-500 dark:text-gray-500 text-[10px] pt-1 border-t border-slate-200 dark:border-slate-700">
                          Oluşturuldu: {formatDate(note.created_at, false)} 
                        </div> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Note Modal */}
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

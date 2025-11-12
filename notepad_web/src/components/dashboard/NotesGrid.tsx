"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import NoteModal from "@/components/dashboard/NoteModal";
import NoteCard from "@/components/dashboard/NoteCard";
import FiltersBar, {
  FilterOptions,
  SortOption,
} from "@/components/dashboard/FiltersBar";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotes } from "@/providers/NotesProvider";
import type { Note, Tag } from "@/types";

interface NotesGridProps {
  searchQuery?: string;
  initialNotes?: Note[];
}

export default function NotesGrid({
  searchQuery = "",
  initialNotes = [],
}: NotesGridProps) {
  const router = useRouter();
  const {
    notes: contextNotes,
    isLoading,
    error,
    refreshNotes,
    deleteSelectedNotes,
  } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<number>>(
    new Set()
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    tags: [],
    dateRange: { start: null, end: null },
    timeRange: "all",
    showFutureNotesOnly: false,
    showPinnedOnly: false,
  });
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");

  // Use initialNotes if available and context is loading, otherwise use context notes
  const notes =
    !isLoading && contextNotes.length > 0 ? contextNotes : initialNotes;

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    notes.forEach((note) => {
      note.tags?.forEach((tag: Tag) => tagsSet.add(tag.name));
    });
    return Array.from(tagsSet);
  }, [notes]);

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = [...notes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags?.some((tag: Tag) => tag.name.toLowerCase().includes(query))
      );
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter((note) =>
        note.tags?.some((tag: Tag) => filters.tags.includes(tag.name))
      );
    }

    if (filters.timeRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.timeRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((note) => {
        const noteDate = new Date(note.created_at);
        return noteDate >= filterDate;
      });
    }

    if (filters.dateRange.start) {
      filtered = filtered.filter(
        (note) =>
          new Date(note.created_at) >= new Date(filters.dateRange.start!)
      );
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(
        (note) => new Date(note.created_at) <= new Date(filters.dateRange.end!)
      );
    }

    if (filters.showFutureNotesOnly) {
      filtered = filtered.filter(
        (note) => note.is_feature_note && note.feature_date
      );
    }

    if (filters.showPinnedOnly) {
      filtered = filtered.filter((note) => note.is_pinned);
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "date-asc":
          return (
            new Date(a.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [notes, searchQuery, filters, sortOption]);

  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.timeRange !== "all" ||
    !!filters.dateRange.start ||
    !!filters.dateRange.end ||
    filters.showFutureNotesOnly ||
    filters.showPinnedOnly;

  const formatDate = (dateString: string, relative = true) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (relative && diffMs > 0) {
      if (diffMins < 60) return `${diffMins} dakika sonra`;
      if (diffHours < 24) return `${diffHours} saat sonra`;
      if (diffDays < 7) return `${diffDays} gün sonra`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta sonra`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay sonra`;
      return `${Math.floor(diffDays / 365)} yıl sonra`;
    }

    if (!relative) {
      const diffMsPast = now.getTime() - date.getTime();
      const diffMinsPast = Math.floor(diffMsPast / (1000 * 60));
      const diffHoursPast = Math.floor(diffMsPast / (1000 * 60 * 60));
      const diffDaysPast = Math.floor(diffMsPast / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDaysPast / 7);
      const diffMonths = Math.floor(diffDaysPast / 30);

      if (diffMinsPast < 60) return `${diffMinsPast} dakika önce`;
      if (diffHoursPast < 24) return `${diffHoursPast} saat önce`;
      if (diffDaysPast < 7) return `${diffDaysPast} gün önce`;
      if (diffWeeks < 4) return `${diffWeeks} hafta önce`;
      if (diffMonths < 12) return `${diffMonths} ay önce`;
      return `${Math.floor(diffMonths / 12)} yıl önce`;
    }

    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year}\n${hours}:${minutes}`;
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedNoteIds(new Set());
  };

  const toggleNoteSelection = (noteId: number) => {
    const newSelection = new Set(selectedNoteIds);
    if (newSelection.has(noteId)) {
      newSelection.delete(noteId);
    } else {
      newSelection.add(noteId);
    }
    setSelectedNoteIds(newSelection);
  };

  const handleDeleteSelected = async () => {
    if (selectedNoteIds.size === 0) return;

    const confirmed = confirm(
      `${selectedNoteIds.size} notu silmek istediğinizden emin misiniz?`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteSelectedNotes(Array.from(selectedNoteIds));
      setSelectedNoteIds(new Set());
      setSelectionMode(false);
      router.refresh();
    } catch (error) {
      console.error("Notlar silinirken hata:", error);
      alert("Notlar silinirken bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 stagger-children">
        {Array.from({ length: 6 }).map((_, i) => (
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
      </div>
    );
  }

  return (
    <div>
      <div className="animate-slide-in-top">
        <FiltersBar
          onFilterChange={setFilters}
          onSortChange={setSortOption}
          availableTags={availableTags}
          currentSort={sortOption}
          selectionMode={selectionMode}
          onToggleSelectionMode={toggleSelectionMode}
          selectedCount={selectedNoteIds.size}
          onDeleteSelected={handleDeleteSelected}
          isDeleting={isDeleting}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mt-4 stagger-children">
        {/* Yeni Not Oluştur Kartı */}
        <div
          onClick={() => router.push("/notes/new")}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer group min-h-[180px] flex flex-col items-center justify-center hover:-translate-y-1"
        >
          <div className="w-12 h-12 mb-3 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <NoteAddIcon
              fontSize="large"
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
          <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">
            Yeni Not Oluştur
          </h3>
          <p className="text-blue-600 dark:text-blue-400 text-xs text-center">
            Fikirlerinizi kaydetmeye başlayın
          </p>
        </div>

        {/* Notlar */}
        {filteredAndSortedNotes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl dark:bg-zinc-800/40 dark:border-zinc-700">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 dark:text-white">
              {searchQuery.trim()
                ? "Arama sonucu bulunamadı"
                : hasActiveFilters
                ? "Filtre sonucu not bulunamadı"
                : "Henüz not yok"}
            </h3>
            <p className="text-gray-500 max-w-xs text-xs sm:text-sm px-4">
              {searchQuery.trim()
                ? "Farklı anahtar kelimeler deneyin."
                : hasActiveFilters
                ? "Farklı filtreler deneyin."
                : "Yukarıdaki karttan ilk notunuzu oluşturun."}
            </p>
          </div>
        ) : (
          filteredAndSortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => setSelectedNote(note)}
              formatDate={formatDate}
              formatFullDate={formatFullDate}
              selectionMode={selectionMode}
              isSelected={selectedNoteIds.has(note.id)}
              onToggleSelect={() => toggleNoteSelection(note.id)}
            />
          ))
        )}
      </div>

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

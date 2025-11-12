"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useNotes } from "@/providers/NotesProvider";
import type { Tag } from "@/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/tr";

interface NewNotePageProps {
  initialTags: Tag[];
}

export default function NewNotePage({ initialTags = [] }: NewNotePageProps) {
  const router = useRouter();
  const { refreshNotes } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>(initialTags);
  const [newTagName, setNewTagName] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");

  const [isFutureNote, setIsFutureNote] = useState(false);
  const [futureDate, setFutureDate] = useState<Dayjs | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Validation states
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    // Only fetch if initialTags is empty
    if (initialTags.length === 0) {
      fetchTags();
    }
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const tags = await api.getTags();
      setAvailableTags(Array.isArray(tags) ? tags : []);
    } catch (error) {
      setAvailableTags([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = await api.createTag(newTagName.trim());
      setAvailableTags([...availableTags, newTag]);
      setSelectedTags([...selectedTags, newTagName.trim()]);
      setNewTagName("");
      setShowTagInput(false);
    } catch (error) {
      console.error("Failed to create tag:", error);
      alert("Tag oluşturulamadı");
    }
  };

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || selectedTags.length === 0) {
      setShowErrors(true);
      return;
    }

    try {
      setIsSaving(true);
      await api.createNote({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags,
        priority: priority,
        is_feature_note: isFutureNote,
        feature_date:
          isFutureNote && futureDate
            ? futureDate.toISOString()
            : new Date().toISOString(),
      });

      await refreshNotes();
      router.push("/");
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Not oluşturulamadı");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 shadow-sm animate-slide-in-top rounded-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-all text-sm sm:text-base hover:scale-105 active:scale-95"
            >
              <ArrowBackIcon fontSize="small" />
              <span className="hidden sm:inline">Geri</span>
            </button>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Yeni Not
            </h1>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm sm:text-base hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              <SaveIcon fontSize="small" />
              <span className="hidden sm:inline">
                {isSaving ? "Kaydediliyor..." : "Kaydet"}
              </span>
              <span className="sm:hidden">{isSaving ? "..." : "Kaydet"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto  py-4 sm:py-6 lg:py-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden animate-scale-in">
          {/* Title Input */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700 animate-slide-in-left">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Başlık..."
              className={`w-full text-xl sm:text-2xl lg:text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 ${
                showErrors && !title.trim()
                  ? "ring-2 ring-red-500 rounded-lg px-2 py-1"
                  : ""
              }`}
              autoFocus
            />
            {showErrors && !title.trim() && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-slide-in-top">
                <span className="text-lg">⚠️</span>
                Başlık zorunludur
              </p>
            )}
          </div>

          {/* Tags Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700 animate-slide-in-right">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`flex items-center gap-2 ${
                  showErrors && selectedTags.length === 0
                    ? "ring-2 ring-red-500 rounded-lg px-2 py-1"
                    : ""
                }`}
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <LocalOfferIcon
                    className="text-blue-600 dark:text-blue-400"
                    fontSize="small"
                  />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Etiketler
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedTags.length > 0
                      ? `${selectedTags.length} etiket seçildi`
                      : "Etiket ekleyerek notunuzu kategorize edin"}
                  </p>
                </div>
              </div>

              {/* Add New Tag Button - Always visible */}
              {!showTagInput && (
                <button
                  onClick={() => setShowTagInput(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <AddIcon fontSize="small" />
                  <span className="hidden sm:inline">Yeni Etiket</span>
                  <span className="sm:hidden">Ekle</span>
                </button>
              )}
            </div>

            {/* New Tag Input - Expanded form */}
            {showTagInput && (
              <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-bold text-blue-900 dark:text-blue-200">
                    Yeni Etiket Oluştur
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newTagName.trim())
                        handleAddNewTag();
                      if (e.key === "Escape") {
                        setShowTagInput(false);
                        setNewTagName("");
                      }
                    }}
                    placeholder="Etiket adını girin..."
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-zinc-800 border-2 border-blue-300 dark:border-blue-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                  <button
                    onClick={handleAddNewTag}
                    disabled={!newTagName.trim()}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md hover:shadow-lg font-medium"
                  >
                    <SaveIcon fontSize="small" />
                    <span className="hidden sm:inline">Kaydet</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowTagInput(false);
                      setNewTagName("");
                    }}
                    className="px-4 py-2.5 bg-red-400 dark:bg-red-700 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all flex items-center gap-2 font-medium"
                  >
                    <CloseIcon fontSize="small" />
                    <span className="hidden sm:inline">İptal</span>
                  </button>
                </div>
              </div>
            )}

            {/* Selected Tags - Enhanced design */}
            {selectedTags.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Seçili Etiketler
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all animate-in fade-in zoom-in duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <LocalOfferIcon fontSize="small" className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="hover:bg-blue-700 rounded-full p-1 transition-colors"
                      >
                        <CloseIcon
                          fontSize="small"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Tags */}
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            ) : availableTags.filter((tag) => !selectedTags.includes(tag.name))
                .length > 0 ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Tıklayarak Ekle
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {
                      availableTags.filter(
                        (tag) => !selectedTags.includes(tag.name)
                      ).length
                    }{" "}
                    etiket
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter((tag) => !selectedTags.includes(tag.name))
                    .map((tag, index) => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.name)}
                        className="group relative px-3 py-2 pl-9 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm hover:border-blue-500 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 dark:hover:border-blue-600 transition-all shadow-sm hover:shadow-md transform hover:scale-105 font-medium animate-in fade-in slide-in-from-bottom-2 duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-gray-200 dark:bg-zinc-700 group-hover:bg-blue-600 dark:group-hover:bg-blue-700 rounded-full transition-all">
                          <AddIcon className="w-2 h-2 text-gray-400 dark:text-gray-400 group-hover:text-white transition-colors" />
                        </span>
                        {tag.name}
                      </button>
                    ))}
                </div>
              </div>
            ) : selectedTags.length === 0 ? (
              <div className="text-center py-8 px-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700">
                <LocalOfferIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                  Henüz etiket bulunmuyor
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  İlk etiketinizi oluşturmak için "Yeni Etiket" butonuna
                  tıklayın
                </p>
              </div>
            ) : null}
            {showErrors && selectedTags.length === 0 && (
              <p className="text-red-500 text-sm mt-3 flex items-center gap-1 animate-slide-in-top">
                <span className="text-lg">⚠️</span>
                En az bir etiket seçmelisiniz
              </p>
            )}
          </div>

          {/* Priority Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700 animate-slide-in-left">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Öncelik Seviyesi
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setPriority("Low")}
                className={`flex flex-col items-center justify-center px-3 py-3 sm:py-4 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 ${
                  priority === "Low"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md"
                    : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-green-300 dark:hover:border-green-700"
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 text-2xl sm:text-3xl font-bold ${
                    priority === "Low"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                  }`}
                >
                  −
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    priority === "Low"
                      ? "text-green-700 dark:text-green-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Düşük
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPriority("Medium")}
                className={`flex flex-col items-center justify-center px-3 py-3 sm:py-4 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 ${
                  priority === "Medium"
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 shadow-md"
                    : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-amber-300 dark:hover:border-amber-700"
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 text-xl sm:text-2xl font-bold ${
                    priority === "Medium"
                      ? "bg-amber-500 text-white"
                      : "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  =
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    priority === "Medium"
                      ? "text-amber-700 dark:text-amber-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Orta
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPriority("High")}
                className={`flex flex-col items-center justify-center px-3 py-3 sm:py-4 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 ${
                  priority === "High"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30 shadow-md"
                    : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-red-300 dark:hover:border-red-700"
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 text-2xl sm:text-3xl font-bold ${
                    priority === "High"
                      ? "bg-red-500 text-white"
                      : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                  }`}
                >
                  !
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    priority === "High"
                      ? "text-red-700 dark:text-red-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Yüksek
                </span>
              </button>
            </div>
          </div>

          {/* Future Note Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700 animate-slide-in-right">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CalendarMonthIcon
                    className="text-blue-600 dark:text-blue-400"
                    fontSize="small"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    İleri Tarihli Not
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Gelecek tarihli hatırlatma ekle
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => {
                  setIsFutureNote(!isFutureNote);
                  if (!isFutureNote) {
                    setShowDatePicker(true);
                  } else {
                    setShowDatePicker(false);
                    setFutureDate(null);
                  }
                }}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
                  isFutureNote
                    ? "bg-blue-600 shadow-lg "
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                    isFutureNote ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Modern MUI Date Picker */}
            {isFutureNote && showDatePicker && (
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="tr"
              >
                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 sm:p-5 border-2 border-blue-200 dark:border-blue-700">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                        <span className="text-sm font-bold text-blue-900 dark:text-blue-200">
                          Hatırlatma Zamanını Seçin
                        </span>
                      </div>

                      <div className="relative">
                        <DateTimePicker
                          value={futureDate}
                          onChange={(newValue) => setFutureDate(newValue)}
                          minDateTime={dayjs()}
                          ampm={false}
                          format="DD MMMM YYYY - HH:mm"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "medium",
                              InputProps: {
                                readOnly: true,
                              },
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "12px",
                                  backgroundColor: "white",
                                  cursor: "pointer",
                                  "& fieldset": {
                                    borderColor: "#60a5fa",
                                    borderWidth: "2px",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#3b82f6",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#2563eb",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  cursor: "pointer",
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#3b82f6",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#2563eb",
                                },
                              },
                            },
                            openPickerButton: {
                              sx: {
                                color: "#2563eb",
                              },
                            },
                          }}
                          label="Tarih ve Saat Seçin"
                        />
                      </div>

                      {futureDate && (
                        <div className="flex items-start gap-3 px-4 py-3 bg-white dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600 rounded-xl animate-in fade-in duration-200 shadow-sm">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              className="w-5 h-5 text-purple-600 dark:text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                              Seçilen Hatırlatma Zamanı
                            </div>
                            <div className="text-sm font-bold text-purple-900 dark:text-purple-200 break-words">
                              📅{" "}
                              {futureDate
                                .locale("tr")
                                .format("DD MMMM YYYY, dddd")}
                            </div>
                            <div className="text-sm font-semibold text-purple-700 dark:text-purple-400 mt-1">
                              🕐 Saat: {futureDate.format("HH:mm")}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </LocalizationProvider>
            )}
          </div>

          {/* Content Editor */}
          <div className="p-4 sm:p-6 animate-slide-in-left">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              placeholder="Notunuzu buraya yazın..."
              className={`w-full min-h-[300px] sm:min-h-[400px] bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 resize-none text-base sm:text-lg leading-relaxed focus:scale-[1.01] transition-transform ${
                showErrors && !content.trim()
                  ? "ring-2 ring-red-500 rounded-lg p-2"
                  : ""
              }`}
            />
            {showErrors && !content.trim() && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-slide-in-top">
                <span className="text-lg">⚠️</span>
                İçerik zorunludur
              </p>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-700 animate-slide-in-bottom">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {content.length} karakter ·{" "}
              {content.split(/\s+/).filter(Boolean).length} kelime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

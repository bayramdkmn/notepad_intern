"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
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

interface Tag {
  id: number;
  name: string;
  color?: string;
}

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");

  // İleri tarihli not state'leri
  const [isFutureNote, setIsFutureNote] = useState(false);
  const [futureDate, setFutureDate] = useState<Dayjs | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const tags = await api.getTags();
      setAvailableTags(Array.isArray(tags) ? tags : []);
    } catch (error) {
      // Tag yoksa sessizce boş array kullan
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
    if (!title.trim() || !content.trim()) {
      alert("Başlık ve içerik zorunludur");
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
      router.push("/");
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Not oluşturulamadı");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors text-sm sm:text-base"
            >
              <ArrowBackIcon fontSize="small" />
              <span className="hidden sm:inline">Geri</span>
            </button>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Yeni Not
            </h1>

            <button
              onClick={handleSave}
              disabled={isSaving || !title.trim() || !content.trim()}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
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
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="bg-white dark:bg-zinc-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
          {/* Title Input */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Başlık..."
              className="w-full text-xl sm:text-2xl lg:text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
              autoFocus
            />
          </div>

          {/* Tags Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <LocalOfferIcon className="text-gray-500" fontSize="small" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Etiketler
              </span>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                    >
                      <CloseIcon
                        fontSize="small"
                        className="w-3 h-3 sm:w-4 sm:h-4"
                      />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Available Tags */}
            {isLoading ? (
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-16 sm:w-20 h-7 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {availableTags
                  .filter((tag) => !selectedTags.includes(tag.name))
                  .map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.name)}
                      className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-full text-xs sm:text-sm hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                    >
                      {tag.name}
                    </button>
                  ))}

                {/* Add New Tag */}
                {showTagInput ? (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleAddNewTag();
                      }}
                      placeholder="Yeni etiket..."
                      className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white rounded-full text-xs sm:text-sm outline-none border border-blue-500 w-24 sm:w-32"
                      autoFocus
                    />
                    <button
                      onClick={handleAddNewTag}
                      className="text-green-600 hover:text-green-700"
                    >
                      <SaveIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => {
                        setShowTagInput(false);
                        setNewTagName("");
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowTagInput(true)}
                    className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs sm:text-sm hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                  >
                    <AddIcon fontSize="small" />
                    Yeni Etiket
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Priority Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700">
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
                className={`flex flex-col items-center justify-center px-3 py-3 sm:py-4 rounded-lg border-2 transition-all ${
                  priority === "Low"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md"
                    : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-green-300 dark:hover:border-green-700"
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                    priority === "Low"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                  }`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
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
                className={`flex flex-col items-center justify-center px-3 py-3 sm:py-4 rounded-lg border-2 transition-all ${
                  priority === "Medium"
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 shadow-md"
                    : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-amber-300 dark:hover:border-amber-700"
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                    priority === "Medium"
                      ? "bg-amber-500 text-white"
                      : "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14"
                    />
                  </svg>
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
                className={`flex flex-col items-center justify-center px-3 py-3 sm:py-4 rounded-lg border-2 transition-all ${
                  priority === "High"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30 shadow-md"
                    : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-red-300 dark:hover:border-red-700"
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 ${
                    priority === "High"
                      ? "bg-red-500 text-white"
                      : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                  }`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
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
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CalendarMonthIcon
                    className="text-purple-600 dark:text-purple-400"
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
                    ? "bg-purple-600 shadow-lg shadow-purple-500/50"
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
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 sm:p-5 border-2 border-purple-200 dark:border-purple-700">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                        <span className="text-sm font-bold text-purple-900 dark:text-purple-200">
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
                                    borderColor: "#c084fc",
                                    borderWidth: "2px",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#a855f7",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#9333ea",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  cursor: "pointer",
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#7e22ce",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#6b21a8",
                                },
                              },
                            },
                            openPickerButton: {
                              sx: {
                                color: "#9333ea",
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
          <div className="p-4 sm:p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Notunuzu buraya yazın..."
              className="w-full min-h-[300px] sm:min-h-[400px] bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 resize-none text-base sm:text-lg leading-relaxed"
            />
          </div>

          {/* Footer Info */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-700">
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

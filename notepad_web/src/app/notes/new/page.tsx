"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

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
  const [isFutureNote, setIsFutureNote] = useState(false);
  const [futureDate, setFutureDate] = useState("");
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
        is_feature_note: isFutureNote,
        feature_date: futureDate
          ? new Date(futureDate).toISOString()
          : undefined,
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Not oluşturulamadı");
    } finally {
      setIsSaving(false);
    }
  };

  const formatSelectedDate = () => {
    if (!futureDate) return "";
    const date = new Date(futureDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
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

          {/* Future Note Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700">
            <div className="space-y-4">
              {/* Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <EventIcon
                      className="text-purple-600 dark:text-purple-400"
                      fontSize="small"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Gelecek Tarihli Not
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Bu notu belirli bir tarihte hatırlatmak için işaretleyin
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFutureNote}
                    onChange={(e) => {
                      setIsFutureNote(e.target.checked);
                      if (e.target.checked) {
                        setShowDatePicker(true);
                      } else {
                        setShowDatePicker(false);
                        setFutureDate("");
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Date Picker - Animated Slide Down */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showDatePicker ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {showDatePicker && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarMonthIcon fontSize="small" />
                      <span>Hatırlatma tarih ve saati seçin</span>
                    </div>

                    {/* Date Time Input */}
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={futureDate}
                        onChange={(e) => setFutureDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border-2 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-600 outline-none transition-all"
                      />
                    </div>

                    {/* Selected Date Display */}
                    {futureDate && (
                      <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            Hatırlatma: {formatSelectedDate()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setFutureDate("");
                            setIsFutureNote(false);
                            setShowDatePicker(false);
                          }}
                          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                        >
                          <CloseIcon fontSize="small" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
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

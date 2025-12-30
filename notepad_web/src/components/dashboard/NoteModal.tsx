"use client";

import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNotes } from "@/providers/NotesProvider";
import { useTags } from "@/providers/TagsProvider";
import type { Tag, Note } from "@/types";

interface NoteModalProps {
  note: Note;
  onClose: () => void;
  formatDate: (dateString: string, isFutureNote?: boolean) => string;
}

export default function NoteModal({
  note,
  onClose,
  formatDate,
}: NoteModalProps) {
  const { updateNote } = useNotes();
  const { tags } = useTags();
  const [currentNote, setCurrentNote] = useState<Note>(note);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedPriority, setEditedPriority] = useState<
    "Low" | "Medium" | "High"
  >(note.priority || "Medium");
  const [editedTags, setEditedTags] = useState<string[]>(
    note.tags?.map((t) => t.name) || []
  );
  const [tagInput, setTagInput] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentNote(note);
  }, [note]);

  useEffect(() => {
    setEditedTitle(currentNote.title);
    setEditedContent(currentNote.content);
    setEditedPriority(currentNote.priority || "Medium");
    setEditedTags(currentNote.tags?.map((t) => t.name) || []);
    setTagInput("");
  }, [currentNote]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedNote = await updateNote(currentNote.id, {
        title: editedTitle,
        content: editedContent,
        priority: editedPriority,
        tags: editedTags.filter((tag) => tag.length > 0),
      });

      setCurrentNote(updatedNote);
      setIsEditing(false);
    } catch (error) {
      console.error("Not güncelleme hatası:", error);
      alert("Not güncellenemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(currentNote.title);
    setEditedContent(currentNote.content);
    setEditedPriority(currentNote.priority || "Medium");
    setEditedTags(currentNote.tags?.map((t) => t.name) || []);
    setTagInput("");
    setIsEditing(false);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !editedTags.includes(trimmedTag)) {
      setEditedTags([...editedTags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Backspace" && !tagInput && editedTags.length > 0) {
      setEditedTags(editedTags.slice(0, -1));
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isEditing) {
          handleCancel();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, isEditing]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex-1 pr-2">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full text-lg sm:text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 dark:border-blue-400 focus:outline-none mb-2"
                placeholder="Not başlığı..."
              />
            ) : (
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                {currentNote.title}
              </h2>
            )}

            {!isEditing && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <AccessTimeIcon fontSize="small" className="w-4 h-4" />
                    <span>
                      Güncellendi: {formatDate(currentNote.updated_at)}
                    </span>
                  </div>
                  {currentNote.created_at !== currentNote.updated_at && (
                    <span className="text-gray-400 text-xs">
                      Oluşturuldu: {formatDate(currentNote.created_at)}
                    </span>
                  )}
                </div>

                {/* Future Note Badge */}
                {currentNote.is_feature_note && currentNote.feature_date && (
                  <div className="mt-3 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 border-2 border-blue-400 dark:border-blue-600 rounded-lg shadow-md">
                      <svg
                        className="w-4 h-4 text-blue-700 dark:text-blue-300"
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
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="text-xs font-bold text-blue-800 dark:text-blue-200">
                          Hatırlatma:{" "}
                          {new Date(
                            currentNote.feature_date
                          ).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-200 dark:bg-blue-800/50 px-2 py-0.5 rounded">
                          Kalan: {formatDate(currentNote.feature_date, true)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 flex-shrink-0"
                title="Düzenle"
              >
                <EditIcon fontSize="small" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 flex-shrink-0"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)]">
          {isEditing ? (
            <div className="space-y-4">
              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İçerik
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-48 px-4 py-3 text-sm sm:text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
                  placeholder="Not içeriği..."
                />
              </div>

              {/* Priority Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Öncelik
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setEditedPriority("Low")}
                    className={`flex flex-col items-center justify-center px-3 py-3 sm:py-4 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 ${
                      editedPriority === "Low"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md"
                        : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-green-300 dark:hover:border-green-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 text-2xl sm:text-3xl font-bold ${
                        editedPriority === "Low"
                          ? "bg-green-500 text-white"
                          : "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
                      }`}
                    >
                      −
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        editedPriority === "Low"
                          ? "text-green-700 dark:text-green-300"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Düşük
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditedPriority("Medium")}
                    className={`flex flex-col items-center justify-center px-3 py-3 sm:py-4 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 ${
                      editedPriority === "Medium"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 shadow-md"
                        : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-amber-300 dark:hover:border-amber-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 text-xl sm:text-2xl font-bold ${
                        editedPriority === "Medium"
                          ? "bg-amber-500 text-white"
                          : "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      =
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        editedPriority === "Medium"
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Orta
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditedPriority("High")}
                    className={`flex flex-col items-center justify-center px-3 py-3 sm:py-4 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 ${
                      editedPriority === "High"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/30 shadow-md"
                        : "border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-red-300 dark:hover:border-red-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 text-2xl sm:text-3xl font-bold ${
                        editedPriority === "High"
                          ? "bg-red-500 text-white"
                          : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                      }`}
                    >
                      !
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        editedPriority === "High"
                          ? "text-red-700 dark:text-red-300"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Yüksek
                    </span>
                  </button>
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Etiketler
                </label>
                {/* Eklenen etiketler */}
                {editedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                    {editedTags.map((tag, index) => (
                      <span
                        key={`edited-tag-${index}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-500/20 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors group"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                        >
                          <CloseIcon fontSize="small" className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Mevcut Etiketlerden Seç */}
                {tags.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                      <LocalOfferIcon fontSize="small" className="w-3 h-3" />
                      Mevcut etiketlerden seçin:
                    </p>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                      {tags.map((tag) => {
                        const isSelected = editedTags.includes(tag.name);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                handleRemoveTag(tag.name);
                              } else {
                                setEditedTags([...editedTags, tag.name]);
                              }
                            }}
                            className={`group relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                                : "bg-white dark:bg-zinc-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-zinc-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            }`}
                          >
                            <span className="flex items-center gap-1">
                              {isSelected && <CloseIcon className="w-3 h-3" />}
                              {tag.name}
                            </span>
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-[10px]">
                                  ✓
                                </span>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Yeni etiket input */}
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    onBlur={handleAddTag}
                    className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                    placeholder="Yeni etiket yazın ve Enter'a basın..."
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    Enter veya virgül
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {currentNote.content}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
          {isEditing ? (
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Kaydediliyor...
                  </>
                ) : (
                  "Kaydet"
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {currentNote.tags && currentNote.tags.length > 0 && (
                  <>
                    <LocalOfferIcon
                      className="text-gray-500 flex-shrink-0"
                      fontSize="small"
                    />
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {currentNote.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-500/20 dark:text-blue-300"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Priority Badge */}
              {currentNote.priority && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      currentNote.priority === "High"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        : currentNote.priority === "Medium"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    }`}
                  >
                    {currentNote.priority === "High"
                      ? "Yüksek Öncelik"
                      : currentNote.priority === "Medium"
                      ? "Orta Öncelik"
                      : "Düşük Öncelik"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

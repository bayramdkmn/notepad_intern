"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Tag, Note } from "@/types";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";

interface TagsPageProps {
  initialTags: Tag[];
}

export default function TagsPage({ initialTags = [] }: TagsPageProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isLoading, setIsLoading] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [affectedNotes, setAffectedNotes] = useState<Note[]>([]);
  const [singleTagNotes, setSingleTagNotes] = useState<Note[]>([]);
  const [replacementTags, setReplacementTags] = useState<Map<number, string>>(
    new Map()
  );
  const [notesToDelete, setNotesToDelete] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [progressSteps, setProgressSteps] = useState<
    {
      message: string;
      status: "pending" | "processing" | "done" | "error";
    }[]
  >([]);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (initialTags.length === 0) {
      fetchTags();
    }
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setIsAdding(true);
      const newTag = await api.createTag(newTagName.trim());
      setTags([...tags, newTag]);
      setNewTagName("");
    } catch (error) {
      console.error("Failed to create tag:", error);
      alert("Etiket oluşturulamadı");
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateTag = async (id: number) => {
    if (!editingName.trim()) return;

    try {
      await api.updateTag(id, editingName.trim());
      setTags(
        tags.map((tag) =>
          tag.id === id ? { ...tag, name: editingName.trim() } : tag
        )
      );
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error("Failed to update tag:", error);
      alert("Etiket güncellenemedi");
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    try {
      const allNotes = await api.getNotes();
      const notesWithTag = allNotes.filter((note: Note) =>
        note.tags.some((t) => t.id === tag.id)
      );

      if (notesWithTag.length === 0) {
        if (confirm("Bu etiketi silmek istediğinizden emin misiniz?")) {
          await api.deleteTag(tag.id);
          setTags(tags.filter((t) => t.id !== tag.id));
        }
        return;
      }

      const single = notesWithTag.filter((note) => note.tags.length === 1);

      setTagToDelete(tag);
      setAffectedNotes(notesWithTag);
      setSingleTagNotes(single);
      setReplacementTags(new Map());
      setDeleteModalOpen(true);
    } catch (error) {
      console.error("Failed to check tag usage:", error);
      alert("Etiket kontrolü yapılamadı");
    }
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;

    const notesWithoutAction = singleTagNotes.filter(
      (note) =>
        !notesToDelete.has(note.id) && !replacementTags.get(note.id)?.trim()
    );

    if (notesWithoutAction.length > 0) {
      const noteNames = notesWithoutAction
        .map((n) => `"${n.title}"`)
        .join(", ");
      const confirmMessage = `${notesWithoutAction.length} notun sadece bu etiketi var ve yeni etiket eklemediniz:\n\n${noteNames}\n\nBu notlar da etiketle birlikte silinecek. Emin misiniz?`;

      if (!confirm(confirmMessage)) {
        setIsDeleting(false);
        return;
      }

      notesWithoutAction.forEach((note) => {
        notesToDelete.add(note.id);
      });
      setNotesToDelete(new Set(notesToDelete));
    }

    try {
      setIsDeleting(true);

      setDeleteModalOpen(false);

      const steps: typeof progressSteps = [];
      const notesWithNewTags = singleTagNotes.filter(
        (note) =>
          !notesToDelete.has(note.id) && replacementTags.get(note.id)?.trim()
      );

      if (notesWithNewTags.length > 0) {
        notesWithNewTags.forEach((note) => {
          steps.push({
            message: `"${note.title}" notuna "${replacementTags.get(
              note.id
            )}" etiketi ekleniyor...`,
            status: "pending",
          });
        });
      }

      steps.push({
        message: `"${tagToDelete.name}" etiketi siliniyor...`,
        status: "pending",
      });

      if (notesToDelete.size > 0) {
        singleTagNotes
          .filter((note) => notesToDelete.has(note.id))
          .forEach((note) => {
            steps.push({
              message: `"${note.title}" notu siliniyor...`,
              status: "pending",
            });
          });
      }

      setProgressSteps(steps);
      setProgressModalOpen(true);

      let currentStepIndex = 0;

      for (const note of singleTagNotes) {
        const newTagName = replacementTags.get(note.id);
        const shouldDeleteNote = notesToDelete.has(note.id);

        if (!shouldDeleteNote && newTagName && newTagName.trim()) {
          setProgressSteps((prev) =>
            prev.map((step, idx) =>
              idx === currentStepIndex
                ? { ...step, status: "processing" }
                : step
            )
          );

          try {
            await api.addTagToNoteByName(note.id, newTagName.trim());

            setProgressSteps((prev) =>
              prev.map((step, idx) =>
                idx === currentStepIndex ? { ...step, status: "done" } : step
              )
            );
            currentStepIndex++;
          } catch (err) {
            setProgressSteps((prev) =>
              prev.map((step, idx) =>
                idx === currentStepIndex
                  ? {
                      ...step,
                      status: "error",
                      message: step.message + " ❌ Başarısız",
                    }
                  : step
              )
            );
            throw new Error(`Not "${note.title}" için etiket eklenemedi`);
          }
        }
      }

      setProgressSteps((prev) =>
        prev.map((step, idx) =>
          idx === currentStepIndex ? { ...step, status: "processing" } : step
        )
      );

      await api.deleteTag(tagToDelete.id);
      setTags(tags.filter((t) => t.id !== tagToDelete.id));

      setProgressSteps((prev) =>
        prev.map((step, idx) =>
          idx === currentStepIndex ? { ...step, status: "done" } : step
        )
      );
      currentStepIndex++;

      for (const note of singleTagNotes) {
        const shouldDeleteNote = notesToDelete.has(note.id);
        if (shouldDeleteNote) {
          setProgressSteps((prev) =>
            prev.map((step, idx) =>
              idx === currentStepIndex
                ? { ...step, status: "processing" }
                : step
            )
          );

          try {
            await api.deleteNote(note.id);
            setProgressSteps((prev) =>
              prev.map((step, idx) =>
                idx === currentStepIndex ? { ...step, status: "done" } : step
              )
            );
          } catch (err) {
            setProgressSteps((prev) =>
              prev.map((step, idx) =>
                idx === currentStepIndex
                  ? {
                      ...step,
                      status: "error",
                      message: step.message + " ❌ Başarısız",
                    }
                  : step
              )
            );
          }
          currentStepIndex++;
        }
      }

      const addedTags = singleTagNotes
        .filter(
          (note) => !notesToDelete.has(note.id) && replacementTags.get(note.id)
        )
        .map((note) => `"${replacementTags.get(note.id)}" → "${note.title}"`)
        .join("\n");

      const deletedNotes = singleTagNotes
        .filter((note) => notesToDelete.has(note.id))
        .map((note) => `"${note.title}"`)
        .join("\n");

      let finalSuccessMessage = `✅ "${tagToDelete.name}" etiketi başarıyla silindi`;
      if (addedTags) {
        finalSuccessMessage += `\n\n📌 Yeni etiketler eklendi:\n${addedTags}`;
      }
      if (deletedNotes) {
        finalSuccessMessage += `\n\n🗑️ Silinen notlar:\n${deletedNotes}`;
      }

      setProgressModalOpen(false);
      closeDeleteModal();

      setSuccessMessage(finalSuccessMessage);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Failed to delete tag:", error);
      setProgressSteps((prev) => [
        ...prev,
        {
          message: `❌ Hata: ${
            error instanceof Error ? error.message : "Bilinmeyen hata"
          }`,
          status: "error",
        },
      ]);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setProgressModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setTagToDelete(null);
    setAffectedNotes([]);
    setSingleTagNotes([]);
    setReplacementTags(new Map());
    setNotesToDelete(new Set());
  };

  const updateReplacementTag = (noteId: number, tagName: string) => {
    const newMap = new Map(replacementTags);
    newMap.set(noteId, tagName);
    setReplacementTags(newMap);

    if (tagName.trim()) {
      const newSet = new Set(notesToDelete);
      newSet.delete(noteId);
      setNotesToDelete(newSet);
    }
  };

  const toggleDeleteNote = (noteId: number) => {
    const newSet = new Set(notesToDelete);
    if (newSet.has(noteId)) {
      newSet.delete(noteId);
    } else {
      newSet.add(noteId);
      const newMap = new Map(replacementTags);
      newMap.delete(noteId);
      setReplacementTags(newMap);
    }
    setNotesToDelete(newSet);
  };

  const startEditing = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="mx-auto max-w-5xl mt-14 md:mt-0 animate-fade-in">
      <div className="mb-8 relative animate-slide-in-top">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-5 -right-10 w-60 h-60 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl transform group-hover:scale-105 transition-transform">
                <LocalOfferIcon className="text-white text-3xl" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-white ">
                Etiket Yönetimi
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Notlarınızı düzenleyin ve kategorize edin
              </p>
            </div>
          </div>
          {tags.length > 0 && (
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center gap-3 px-5 py-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-zinc-700/50">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    {tags.length}
                  </span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400  tracking-wider">
                    Etiket
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add New Tag Form - Ultra Modern */}
      <form
        onSubmit={handleAddTag}
        className="relative group mb-8 animate-in slide-in-from-bottom-4 duration-500"
      >
        <div className="absolute inset-0  rounded-2xl blur opacity-10 group-hover:opacity-15 transition-opacity"></div>
        <div className="relative bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-zinc-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Yeni Etiket Oluştur
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative group/input">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-0 group-hover/input:opacity-10 transition-opacity"></div>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="✨ Etiket adını buraya yazın..."
                className="relative w-full px-5 py-3.5 bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-sm border-2 border-gray-200 dark:border-zinc-700 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-green-500 dark:focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isAdding || !newTagName.trim()}
              className="group/btn relative px-6 py-3.5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2">
                <AddIcon className="text-xl" />
                {isAdding ? "Oluşturuluyor..." : "Oluştur"}
              </span>
            </button>
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="relative group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-5 animate-pulse"></div>
              <div className="relative h-24 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-zinc-700/50 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="relative group animate-in fade-in zoom-in duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-500 to-pink-500 rounded-3xl blur-2xl opacity-5 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-3xl p-16 text-center border border-white/20 dark:border-zinc-700/50">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full blur opacity-20"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <LocalOfferIcon className="text-white text-5xl" />
              </div>
            </div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
              Henüz Etiket Bulunmuyor
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-2 max-w-md mx-auto">
              İlk etiketinizi oluşturmak için yukarıdaki formu kullanın
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              ✨ Etiketler notlarınızı organize etmenize yardımcı olur
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-10 bg-gradient-to-b from-blue-600 to-blue-600 rounded-full"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Tüm Etiketleriniz
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tags.length} etiket bulundu
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {tags.map((tag, index) => (
              <div
                key={tag.id}
                className="relative group animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-zinc-700/50 p-5 group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-all">
                  {editingId === tag.id ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleUpdateTag(tag.id);
                            if (e.key === "Escape") cancelEditing();
                          }}
                          className="w-full px-5 py-3 bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border-2 border-blue-500 dark:border-blue-600 rounded-xl text-base text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all"
                          autoFocus
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateTag(tag.id)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold text-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <SaveIcon fontSize="small" />
                          Kaydet
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold text-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <CloseIcon fontSize="small" />
                          İptal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative group/icon">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl blur opacity-20 group-hover/icon:opacity-30 transition-opacity"></div>
                          <div className="relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover/icon:scale-105 transition-transform">
                            <LocalOfferIcon className="text-white text-xl" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {tag.name}
                          </h3>
                          {tag.notes_count !== undefined && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {tag.notes_count}{" "}
                                {tag.notes_count === 1 ? "not" : "not"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEditing(tag)}
                          className="group/btn flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 border-2 border-gray-300 dark:border-zinc-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-semibold text-sm text-gray-700 dark:text-gray-300 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <EditIcon className="text-lg group-hover/btn:text-blue-600 dark:group-hover/btn:text-blue-400 transition-colors" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag)}
                          className="group/btn flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 border-2 border-red-300 dark:border-red-800 rounded-xl hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold text-sm text-red-600 dark:text-red-400 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <DeleteIcon className="text-lg" />
                          Sil
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && tagToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <WarningIcon className="text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Etiket Silme Onayı
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      "{tagToDelete.name}" etiketi silinecek
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Info Banner */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <InfoIcon className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                      Bu etiket {affectedNotes.length} notta kullanılıyor
                    </p>
                    {singleTagNotes.length > 0 && (
                      <p className="text-amber-800 dark:text-amber-300">
                        {singleTagNotes.length} notun{" "}
                        <strong>sadece bu etiketi</strong> var. Bu notlar için
                        yeni etiket ekleyebilir veya notları silebilirsiniz.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Single Tag Notes Warning */}
              {singleTagNotes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <WarningIcon className="text-red-500" fontSize="small" />
                    Tek Etiketli Notlar ({singleTagNotes.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {singleTagNotes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-3 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-gray-900 dark:text-white text-sm flex-1">
                            {note.title}
                          </p>
                          <button
                            onClick={() => toggleDeleteNote(note.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              notesToDelete.has(note.id)
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-gray-200 text-gray-700 dark:bg-zinc-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            }`}
                          >
                            <DeleteIcon fontSize="small" className="w-3 h-3" />
                            {notesToDelete.has(note.id) ? "İptal" : "Notu Sil"}
                          </button>
                        </div>

                        {!notesToDelete.has(note.id) && (
                          <>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Yeni etiket adı..."
                                value={replacementTags.get(note.id) || ""}
                                onChange={(e) =>
                                  updateReplacementTag(note.id, e.target.value)
                                }
                                className="flex-1 px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            {!replacementTags.get(note.id) && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                <InfoIcon
                                  fontSize="small"
                                  className="w-3 h-3 mt-0.5"
                                />
                                Yeni etiket ekleyin veya "Notu Sil" butonuna
                                tıklayın
                              </p>
                            )}
                          </>
                        )}

                        {notesToDelete.has(note.id) && (
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
                            <p className="text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
                              <WarningIcon
                                fontSize="small"
                                className="w-3 h-3"
                              />
                              Bu not etiketle birlikte silinecek
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Affected Notes */}
              {affectedNotes.length > singleTagNotes.length && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Diğer Etkilenen Notlar (
                    {affectedNotes.length - singleTagNotes.length})
                  </h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {affectedNotes
                      .filter((note) => note.tags.length > 1)
                      .map((note) => (
                        <div
                          key={note.id}
                          className="bg-gray-50 dark:bg-zinc-700/50 rounded p-2"
                        >
                          <p className="text-sm text-gray-900 dark:text-white">
                            {note.title}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {note.tags
                              .filter((t) => t.id !== tagToDelete.id)
                              .map((t) => (
                                <span
                                  key={t.id}
                                  className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                                >
                                  {t.name}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 p-6">
              {/* Summary */}
              {notesToDelete.size > 0 && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-300 flex items-center gap-2">
                    <WarningIcon fontSize="small" />
                    <strong>{notesToDelete.size} not silinecek</strong>
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <DeleteIcon fontSize="small" />
                  {isDeleting
                    ? "Siliniyor..."
                    : notesToDelete.size > 0
                    ? `Etiketi ve ${notesToDelete.size} Notu Sil`
                    : "Etiketi Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {progressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-xl">
              <div className="flex items-center gap-3 text-white">
                <CircularProgress size={24} className="text-white" />
                <h2 className="text-xl font-bold">İşlem Devam Ediyor...</h2>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {progressSteps.map((step, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg transition-all"
                    style={{
                      backgroundColor:
                        step.status === "done"
                          ? "rgb(220 252 231)"
                          : step.status === "error"
                          ? "rgb(254 226 226)"
                          : step.status === "processing"
                          ? "rgb(219 234 254)"
                          : "rgb(243 244 246)",
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {step.status === "done" && (
                        <CheckCircleIcon className="text-green-600" />
                      )}
                      {step.status === "error" && (
                        <ErrorIcon className="text-red-600" />
                      )}
                      {step.status === "processing" && (
                        <CircularProgress size={24} className="text-blue-600" />
                      )}
                      {step.status === "pending" && (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>

                    {/* Message */}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          step.status === "done"
                            ? "text-green-800 dark:text-green-600"
                            : step.status === "error"
                            ? "text-red-800 dark:text-red-600"
                            : step.status === "processing"
                            ? "text-blue-800 dark:text-blue-600"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {step.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {successModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-xl">
              <div className="flex items-center gap-3 text-white">
                <CheckCircleIcon fontSize="large" />
                <h2 className="text-xl font-bold">İşlem Başarılı!</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4">
                <p className="text-sm whitespace-pre-line font-medium text-green-900 dark:text-green-100">
                  {successMessage}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 p-6">
              <button
                onClick={() => setSuccessModalOpen(false)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { api } from "@/lib/api";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

interface Tag {
  id: number;
  name: string;
  notes_count?: number;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTags();
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

  const handleDeleteTag = async (id: number) => {
    if (!confirm("Bu etiketi silmek istediğinizden emin misiniz?")) return;

    try {
      await api.deleteTag(id);
      setTags(tags.filter((tag) => tag.id !== id));
    } catch (error) {
      console.error("Failed to delete tag:", error);
      alert("Etiket silinemedi");
    }
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
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl mt-14 sm:mt-0">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <LocalOfferIcon className="text-blue-600 dark:text-blue-400 text-xl sm:text-2xl" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Etiket Yönetimi
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Etiketlerinizi oluşturun, düzenleyin ve yönetin.
            </p>
          </div>

          {/* Add New Tag Form */}
          <form
            onSubmit={handleAddTag}
            className="bg-white dark:bg-zinc-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-zinc-700 mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Yeni etiket adı..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-[#242424] border border-gray-300 dark:border-zinc-600 rounded-lg text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isAdding || !newTagName.trim()}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
              >
                <AddIcon fontSize="small" />
                {isAdding ? "Ekleniyor..." : "Ekle"}
              </button>
            </div>
          </form>

          {isLoading ? (
            <div className="space-y-2 sm:space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 sm:h-16 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : tags.length === 0 ? (
            <div className="bg-white dark:bg-zinc-800 rounded-lg sm:rounded-xl p-8 sm:p-12 text-center border border-gray-200 dark:border-zinc-700">
              <LocalOfferIcon
                fontSize="large"
                className="text-gray-400 mb-3 sm:mb-4 mx-auto"
              />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                Henüz etiket yok
              </h3>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                İlk etiketinizi yukarıdaki formdan oluşturun.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 divide-y divide-gray-200 dark:divide-zinc-700">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors gap-3"
                >
                  {editingId === tag.id ? (
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-900 border border-blue-500 rounded-lg text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateTag(tag.id)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <SaveIcon fontSize="small" />
                          <span className="hidden sm:inline">Kaydet</span>
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          <CloseIcon fontSize="small" />
                          <span className="hidden sm:inline">İptal</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex items-center gap-2 sm:gap-3 flex-1">
                        <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-500/20 dark:text-blue-300">
                          {tag.name}
                        </span>
                        {tag.notes_count !== undefined && (
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {tag.notes_count} not
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(tag)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
                        >
                          <EditIcon fontSize="small" />
                          <span className="hidden sm:inline">Düzenle</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <DeleteIcon fontSize="small" />
                          <span className="hidden sm:inline">Sil</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {tags.length > 0 && (
            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Toplam {tags.length} etiket
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

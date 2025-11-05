"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

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
      <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowBackIcon />
            <span className="hidden sm:inline">Geri</span>
          </button>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Yeni Not
          </h1>

          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <SaveIcon fontSize="small" />
            <span className="hidden sm:inline">
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
          {/* Title Input */}
          <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Başlık..."
              className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
              autoFocus
            />
          </div>

          {/* Tags Section */}
          <div className="p-6 border-b border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <LocalOfferIcon className="text-gray-500" fontSize="small" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Etiketler
              </span>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                    >
                      <CloseIcon fontSize="small" className="w-3 h-3" />
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
                    className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter((tag) => !selectedTags.includes(tag.name))
                  .map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.name)}
                      className="px-3 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                    >
                      {tag.name}
                    </button>
                  ))}

                {/* Add New Tag */}
                {showTagInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleAddNewTag();
                      }}
                      placeholder="Yeni etiket..."
                      className="px-3 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white rounded-full text-sm outline-none border border-blue-500"
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
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                  >
                    <AddIcon fontSize="small" />
                    Yeni Etiket
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div className="p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Notunuzu buraya yazın..."
              className="w-full min-h-[400px] bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 resize-none text-lg leading-relaxed"
            />
          </div>

          {/* Footer Info */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {content.length} karakter ·{" "}
              {content.split(/\s+/).filter(Boolean).length} kelime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

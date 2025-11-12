"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import type { Tag, TagsContextType } from "@/types";

const TagsContext = createContext<TagsContextType | undefined>(undefined);

const TAGS_STORAGE_KEY = "brain_ai_tags";
const TAGS_TIMESTAMP_KEY = "brain_ai_tags_timestamp";
const CACHE_DURATION = 5 * 60 * 1000;

export function TagsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromStorage = useCallback(() => {
    if (!isAuthenticated) return false;

    try {
      const storedTags = localStorage.getItem(TAGS_STORAGE_KEY);
      const timestamp = localStorage.getItem(TAGS_TIMESTAMP_KEY);

      if (storedTags && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          setTags(JSON.parse(storedTags));
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("LocalStorage okuma hatası:", err);
      return false;
    }
  }, [isAuthenticated]);

  const saveToStorage = useCallback((tagsToSave: Tag[]) => {
    try {
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tagsToSave));
      localStorage.setItem(TAGS_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.error("LocalStorage yazma hatası:", err);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const fetchedTags = await apiClient.getTags();
      const tagsArray = Array.isArray(fetchedTags) ? fetchedTags : [];
      setTags(tagsArray);
      saveToStorage(tagsArray);
    } catch (err: any) {
      setError(err.message || "Etiketler yüklenirken bir hata oluştu");
      console.error("Etiketleri çekme hatası:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, saveToStorage]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setTags([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const hasValidCache = loadFromStorage();

    if (hasValidCache) {
      setIsLoading(false);
      fetchTags();
    } else {
      fetchTags();
    }
  }, [isAuthenticated, authLoading, loadFromStorage, fetchTags]);

  const refreshTags = useCallback(async () => {
    await fetchTags();
  }, [fetchTags]);

  const createTag = useCallback(
    async (name: string) => {
      try {
        const newTag = await apiClient.createTag(name);
        setTags((prev) => {
          const updated = [...prev, newTag];
          saveToStorage(updated);
          return updated;
        });
        return newTag;
      } catch (err: any) {
        console.error("Etiket oluşturma hatası:", err);
        throw err;
      }
    },
    [saveToStorage]
  );

  const updateTag = useCallback(
    async (id: number, name: string) => {
      try {
        const updatedTag = await apiClient.updateTag(id, name);
        setTags((prev) => {
          const updated = prev.map((tag) => (tag.id === id ? updatedTag : tag));
          saveToStorage(updated);
          return updated;
        });
        return updatedTag;
      } catch (err: any) {
        console.error("Etiket güncelleme hatası:", err);
        throw err;
      }
    },
    [saveToStorage]
  );

  const deleteTag = useCallback(
    async (id: number) => {
      try {
        await apiClient.deleteTag(id);
        setTags((prev) => {
          const updated = prev.filter((tag) => tag.id !== id);
          saveToStorage(updated);
          return updated;
        });
      } catch (err: any) {
        console.error("Etiket silme hatası:", err);
        throw err;
      }
    },
    [saveToStorage]
  );

  const value: TagsContextType = {
    tags,
    isLoading,
    error,
    refreshTags,
    createTag,
    updateTag,
    deleteTag,
  };

  return <TagsContext.Provider value={value}>{children}</TagsContext.Provider>;
}

export function useTags() {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error("useTags must be used within a TagsProvider");
  }
  return context;
}

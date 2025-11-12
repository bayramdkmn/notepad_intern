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
import type { Note, NotesContextType } from "@/types";

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const NOTES_STORAGE_KEY = "brain_ai_notes";
const NOTES_TIMESTAMP_KEY = "brain_ai_notes_timestamp";
const CACHE_DURATION = 5 * 60 * 1000;

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromStorage = useCallback(() => {
    if (!isAuthenticated) return false;

    try {
      const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      const timestamp = localStorage.getItem(NOTES_TIMESTAMP_KEY);

      if (storedNotes && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age < CACHE_DURATION) {
          setNotes(JSON.parse(storedNotes));
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error("LocalStorage okuma hatası:", err);
      return false;
    }
  }, [isAuthenticated]);

  const saveToStorage = useCallback((notesToSave: Note[]) => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesToSave));
      localStorage.setItem(NOTES_TIMESTAMP_KEY, Date.now().toString());
    } catch (err) {
      console.error("LocalStorage yazma hatası:", err);
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response: any = await apiClient.getNotes();
      const fetchedNotes = Array.isArray(response)
        ? response
        : response.notes || [];
      setNotes(fetchedNotes);
      saveToStorage(fetchedNotes);
    } catch (err: any) {
      setError(err.message || "Notlar yüklenirken bir hata oluştu");
      console.error("Notları çekme hatası:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, saveToStorage]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setNotes([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const hasValidCache = loadFromStorage();

    if (hasValidCache) {
      setIsLoading(false);
      fetchNotes();
    } else {
      fetchNotes();
    }
  }, [isAuthenticated, authLoading, loadFromStorage, fetchNotes]);

  const refreshNotes = useCallback(async () => {
    await fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(
    async (data: {
      title: string;
      content: string;
      tags?: string[];
      priority?: "Low" | "Medium" | "High";
      is_feature_note?: boolean;
      feature_date?: string;
    }) => {
      try {
        const newNote = await apiClient.createNote(data);
        setNotes((prev) => {
          const updated = [newNote, ...prev];
          saveToStorage(updated);
          return updated;
        });
        return newNote;
      } catch (err: any) {
        console.error("Not oluşturma hatası:", err);
        throw err;
      }
    },
    [saveToStorage]
  );

  const updateNote = useCallback(
    async (
      id: number,
      data: {
        title?: string;
        content?: string;
        tags?: string[];
        priority?: "Low" | "Medium" | "High";
      }
    ) => {
      try {
        const updatedNote = await apiClient.updateNote(id, data);
        setNotes((prev) => {
          const updated = prev.map((note) =>
            note.id === id ? updatedNote : note
          );
          saveToStorage(updated);
          return updated;
        });
        return updatedNote;
      } catch (err: any) {
        console.error("Not güncelleme hatası:", err);
        throw err;
      }
    },
    [saveToStorage]
  );

  const deleteNote = useCallback(
    async (id: number) => {
      try {
        await apiClient.deleteNote(id);
        setNotes((prev) => {
          const updated = prev.filter((note) => note.id !== id);
          saveToStorage(updated);
          return updated;
        });
      } catch (err: any) {
        console.error("Not silme hatası:", err);
        throw err;
      }
    },
    [saveToStorage]
  );

  const deleteSelectedNotes = useCallback(
    async (ids: number[]) => {
      try {
        await apiClient.deleteSelectedNotes(ids);
        setNotes((prev) => {
          const updated = prev.filter((note) => !ids.includes(note.id));
          saveToStorage(updated);
          return updated;
        });
      } catch (err: any) {
        console.error("Toplu not silme hatası:", err);
        throw err;
      }
    },
    [saveToStorage]
  );

  const togglePin = useCallback(
    async (id: number) => {
      const previousNotes = notes;

      // Optimistic update
      setNotes((prev) => {
        const updated = prev.map((note) =>
          note.id === id ? { ...note, is_pinned: !note.is_pinned } : note
        );
        saveToStorage(updated);
        return updated;
      });

      try {
        await apiClient.togglePinNote(id);
      } catch (err) {
        console.error("Toggle pin hatası:", err);
        setNotes(previousNotes);
        saveToStorage(previousNotes);
        throw err;
      }
    },
    [notes, saveToStorage]
  );

  const pinnedNotes = notes.filter((note) => note.is_pinned);
  const futureNotes = notes.filter(
    (note) => note.is_feature_note && note.feature_date
  );

  const value: NotesContextType = {
    notes,
    pinnedNotes,
    futureNotes,
    isLoading,
    error,
    refreshNotes,
    createNote,
    updateNote,
    deleteNote,
    deleteSelectedNotes,
    togglePin,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}

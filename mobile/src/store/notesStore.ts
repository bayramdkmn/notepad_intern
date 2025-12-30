import { create } from "zustand";
import { fetchNotes, createNote, pinnedNote, getAllTagsByUser, deleteNote } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note, Tag } from "../types";

type NotesState = {
  pinnedNote(noteId: number): unknown;
  notes: Note[];
  isLoading: boolean;
  error?: string;
  fetchNotes: () => Promise<void>;
  addNote: (payload: { title: string; content: string }) => Promise<void>;
  deleteNote: (noteId: number) => Promise<void>;
};

let token: string | null = null;

(async () => {
  try {
    token = await AsyncStorage.getItem("accessToken");
    if (!token) console.warn("Token bulunamadı");
  } catch (error) {
    console.error("Token alınırken hata oluştu:", error);
  }
})();

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: undefined,

  fetchNotes: async () => {
    set({ isLoading: true, error: undefined });
    try {
      if (!token) throw new Error("Token bulunamadı");
      const data = await fetchNotes(token);
      set({ notes: data.map((item) => ({ content: "", ...item })), isLoading: false });
    } catch (error: any) {
      set({ error: error?.message ?? "Notlar alınamadı", isLoading: false });
    }
  },

  addNote: async (payload) => {
    const { notes } = get();
    if (!token) {
      set({ error: "Token bulunamadı" });
      return;
    }
    set({ error: undefined });
    try {
      const created = await createNote(token, payload);
      set({
        notes: [
          { id: created.id, title: payload.title, content: payload.content, tags: [], created_at: created.created_at },
          ...notes,
        ],
      });
    } catch (error: any) {
      set({ error: error?.message ?? "Not eklenemedi" });
    }
  },

  deleteNote: async (noteId: number) => {
    const { notes } = get();
    if (!token) {
      set({ error: "Token bulunamadı" });
      return;
    }
    set({ error: undefined });
    try {
      await deleteNote(token, noteId);
      set({
        notes: notes.filter((note) => note.id !== noteId),
      });
    } catch (error: any) {
      set({ error: error?.message ?? "Not silinemedi" });
    }
  },  

  pinnedNote: async (noteId: number) => {
    const { notes } = get();
    if (!token) {
      set({ error: "Token bulunamadı" });
      return;
    }
    set({ error: undefined });
    try {

      const updatedNote = await pinnedNote(token, noteId);

      set({
        notes: notes.map((note) =>
          note.id === noteId ? { ...note, is_pinned: updatedNote.is_pinned } : note
        ),
      });
    } catch (error: any) {
      set({ error: error?.message ?? "Not pinlenemedi" });
    }
  },
}));
{/*import { create } from "zustand";
import { fetchNotes, createNote } from "../api";

type Note = {
  id: number;
  title: string;
  content?: string;
};

type NotesState = {
  notes: Note[];
  isLoading: boolean;
  error?: string;
  fetchNotes: () => Promise<void>;
  addNote: (payload: { title: string; content: string }) => Promise<void>;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: undefined,

  fetchNotes: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const data = await fetchNotes();
      set({ notes: data.map((item) => ({ content: "", ...item })), isLoading: false });
    } catch (error: any) {
      set({ error: error?.message ?? "Notlar alınamadı", isLoading: false });
    }
  },

  addNote: async (payload) => {
    const { notes } = get();
    try {
      const created = await createNote(payload);
      set({
        notes: [
          { id: created.id, title: payload.title, content: payload.content },
          ...notes,
        ],
      });
    } catch (error: any) {
      set({ error: error?.message ?? "Not eklenemedi" });
    }
  },
}));
*/}


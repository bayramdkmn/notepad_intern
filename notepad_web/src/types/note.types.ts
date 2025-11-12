// ==================== Note Types ====================

import type { Tag } from './tag.types';

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  is_pinned?: boolean;
  is_favorite?: boolean;
  is_feature_note?: boolean;
  feature_date?: string | null;
  priority?: "Low" | "Medium" | "High";
  scheduled_for?: string | null;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
  priority?: "Low" | "Medium" | "High";
  is_feature_note?: boolean;
  feature_date?: string;
  scheduled_for?: string | null;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  tags?: string[];
  priority?: "Low" | "Medium" | "High";
  is_pinned?: boolean;
  is_favorite?: boolean;
  scheduled_for?: string | null;
}

// ==================== Notes Context Type ====================

export interface NotesContextType {
  notes: Note[];
  pinnedNotes: Note[];
  futureNotes: Note[];
  isLoading: boolean;
  error: string | null;
  refreshNotes: () => Promise<void>;
  createNote: (data: {
    title: string;
    content: string;
    tags?: string[];
    priority?: "Low" | "Medium" | "High";
    is_feature_note?: boolean;
    feature_date?: string;
  }) => Promise<Note>;
  updateNote: (
    id: number,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
      priority?: "Low" | "Medium" | "High";
    }
  ) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  deleteSelectedNotes: (ids: number[]) => Promise<void>;
  togglePin: (id: number) => Promise<void>;
}

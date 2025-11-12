// ==================== Tag Types ====================

export interface Tag {
  id: number;
  name: string;
  color?: string;
  notes_count?: number;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}

// ==================== Tags Context Type ====================

export interface TagsContextType {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  refreshTags: () => Promise<void>;
  createTag: (name: string) => Promise<Tag>;
  updateTag: (id: number, name: string) => Promise<Tag>;
  deleteTag: (id: number) => Promise<void>;
}

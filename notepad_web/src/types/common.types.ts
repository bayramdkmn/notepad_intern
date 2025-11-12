// ==================== Common/Shared Types ====================

export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// ==================== Filter & Sort Types ====================

export interface FilterOptions {
  tags: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  timeRange: "all" | "today" | "week" | "month";
  showFutureNotesOnly: boolean;
  showPinnedOnly: boolean;
}

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "title-asc"
  | "title-desc"
  | "priority-high"
  | "priority-low";

export interface FiltersBarProps {
  availableTags: string[];
  filters: FilterOptions;
  sortOption: SortOption;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOption) => void;
}

export interface ModalState {
  isOpen: boolean;
  noteId: number | null;
}


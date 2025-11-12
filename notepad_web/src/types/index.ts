// ==================== Authentication Types ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  user?: {
    id: number;
    email: string;
    name: string;
    surname?: string;
    username?: string;
    phone_number?: string;
  };
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  surname: string;
  username: string;
  phone_number?: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ==================== Note Types ====================

export interface Tag {
  id: number;
  name: string;
  color?: string;
  notes_count?: number;
}

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

// ==================== Tag Types ====================

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}

// ==================== Password Reset Types ====================

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

// ==================== API Error Types ====================

export interface ApiError {
  detail: string;
  status_code?: number;
}

// ==================== Context Types ====================

export interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (data: UpdateUserRequest) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  resetPassword?: (
    otp: string,
    new_password: string,
    confirm_new_password: string
  ) => Promise<void>;
}

export interface NotesContextType {
  notes: Note[];
  pinnedNotes?: Note[];
  futureNotes?: Note[];
  isLoading: boolean;
  error?: string | null;
  refreshNotes: () => Promise<void>;
  addNote?: (note: Note) => void;
  updateNote?: (note: Note) => void;
  deleteNote?: (id: number) => void;
  createNote?: (note: CreateNoteRequest) => Promise<Note>;
  togglePin?: (id: number) => Promise<void>;
  toggleFavorite?: (id: number) => Promise<void>;
}

export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// ==================== Component Props Types ====================

export interface HomePageProps {
  initialNotes: Note[];
}

export interface TagsPageProps {
  initialTags: Tag[];
}

export interface ProfilePageProps {
  initialUser: UserResponse | null;
}

export interface NewNotePageProps {
  initialTags: Tag[];
}

export interface NoteCardProps {
  note: Note;
  onUpdate?: (note: Note) => void;
  onDelete?: (id: number) => void;
}

export interface NoteModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (note: Note) => void;
  onDelete?: (id: number) => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

export interface FiltersBarProps {
  onFilterChange: (filters: NoteFilters) => void;
}

export interface NotesGridProps {
  searchQuery?: string;
  initialNotes?: Note[];
}

// ==================== Filter & Sort Types ====================

export interface NoteFilters {
  priority?: "Low" | "Medium" | "High" | null;
  isPinned?: boolean;
  isFavorite?: boolean;
  tags?: number[];
  dateFrom?: string;
  dateTo?: string;
}

export type SortOption = "date" | "title" | "priority";
export type SortDirection = "asc" | "desc";

// ==================== Form Types ====================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  selectedTags: string[];
  priority: "Low" | "Medium" | "High";
  isFutureNote: boolean;
  futureDate: string | null;
}

// ==================== Modal State Types ====================

export interface DeleteModalState {
  isOpen: boolean;
  tagToDelete: Tag | null;
  affectedNotes: Note[];
  singleTagNotes: Note[];
  replacementTags: Map<number, string>;
  notesToDelete: Set<number>;
}

export interface ProgressStep {
  message: string;
  status: "pending" | "processing" | "done" | "error";
}

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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

// ==================== Auth Context Type ====================

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

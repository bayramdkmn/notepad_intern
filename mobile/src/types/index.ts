// Navigation Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyCode: { email: string };
  ResetPassword: { email: string; code?: string };
};

export type MainDrawerParamList = {
  Notes: undefined;
  Tags: undefined;
  Settings: undefined;
};

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  username?: string;
  phone_number?: string;
  avatar?: string;
}

// Note Types
export interface Note {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
  created_at: string;
  updated_at?: string;
  is_pinned?: boolean;
  is_favorite?: boolean;
  is_feature_note?: boolean;
  feature_date?: string | null;
  priority?: "Low" | "Medium" | "High";
  scheduled_for?: string | null;
}

// Tag Types
export interface Tag {
  id: number;
  name: string;
  color?: string;
  usage_count?: number;
}

// Theme Types
export type ColorSchemeType = "light" | "dark";


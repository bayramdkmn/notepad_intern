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
  avatar?: string;
}

// Note Types
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  color: string;
  noteCount: number;
}

// Theme Types
export type ColorSchemeType = "light" | "dark";


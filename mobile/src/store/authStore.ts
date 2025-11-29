import { create } from "zustand";
import * as api from "../api";
import { User } from "../types";

type RegisterPayload = {
  name: string;
  surname: string;
  username: string;
  email: string;
  password_hash: string;
  phone_number: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await api.login({ email, password });
      if(response?.status === 401 || response?.status === 403) {
        throw new Error("Geçersiz e-posta adresi veya şifre");
      }
      
      set({
        isLoggedIn: true,
        user: { id: response.data.id, email, name: response.data.name },
      });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (data: RegisterPayload) => {
    try {
      set({ isLoading: true });
      await api.register({
        email: data.email,
        password: data.password_hash,
        firstName: data.name,
        lastName: data.surname,
        username: data.username,
        phone: data.phone_number || undefined,
      });
      set({
        isLoggedIn: true,
        user: {
          id: "1",
          email: data.email,
          name: `${data.name} ${data.surname}`,
        },
      });
    } catch (error: any) {
      // Backend'den gelen hata mesajını kontrol et
      const errorMessage = error?.message || "";
      const errorString = errorMessage.toLowerCase();
      
      // Duplicate email/username kontrolü (400 veya 500 status kodları için)
      if (
        (error?.status === 400 || error?.status === 500) &&
        (errorString.includes("already exists") ||
          errorString.includes("already taken") ||
          errorString.includes("duplicate") ||
          errorString.includes("unique constraint") ||
          errorString.includes("email") ||
          errorString.includes("username"))
      ) {
        if (errorString.includes("email") || errorString.includes("e-posta")) {
          throw new Error("Bu e-posta adresi zaten kullanılıyor. Lütfen farklı bir e-posta deneyin.");
        } else if (errorString.includes("username") || errorString.includes("kullanıcı")) {
          throw new Error("Bu kullanıcı adı zaten kullanılıyor. Lütfen farklı bir kullanıcı adı deneyin.");
        } else {
          throw new Error("Bu bilgiler zaten kullanılıyor. Lütfen farklı bilgiler deneyin.");
        }
      }
      // Diğer hataları olduğu gibi fırlat
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    // TODO: access token saklayınca api.logout(token) çağır
    set({ isLoggedIn: false, user: null });
  },

  resetPassword: async (_email: string) => {
    // TODO: backend'le entegre et
    return;
  },
}));
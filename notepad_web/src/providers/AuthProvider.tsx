"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type {
  AuthContextType,
  UserResponse,
  RegisterRequest,
  UpdateUserRequest,
} from "@/types";

type User = UserResponse;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Failed to parse saved user:", error);
      localStorage.removeItem("user");
    }

    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const token = getCookie("auth-token");
      if (token) {
        if (isInitialized) {
          setIsLoading(false);
          return;
        }

        const userData = await api.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      deleteCookie("auth-token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });

      setCookie("auth-token", response.access_token, 7); // 7 gün

      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const response = await api.register(userData);

      setCookie("auth-token", response.access_token, 7);

      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const user = await api.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }

      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const updateUser = async (data: UpdateUserRequest) => {
    try {
      if (!user) {
        throw new Error("User not found");
      }

      const updatedUser = await api.updateProfile({
        name: data.firstName,
        surname: data.lastName,
        username: user.username || "",
        phone_number: data.phone || "",
        email: user.email,
      });
      setUser(updatedUser);
    } catch (error) {
      console.error("Update user failed:", error);
      throw error;
    }
  };

  const resetPassword = async (
    otp: string,
    new_password: string,
    confirm_new_password?: string
  ) => {
    try {
      await api.resetPassword({
        otp: otp,
        new_password: new_password,
        confirm_new_password: confirm_new_password || new_password,
      });
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      logout();
    } catch (error) {
      console.error("Change password failed:", error);
      throw error;
    }
  };

  const logout = () => {
    deleteCookie("auth-token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUser,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Cookie helper functions
function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // SameSite=Lax Safari uyumluluğu için
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
  return value || null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

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

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (data: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // İlk mount'ta localStorage'dan user bilgilerini HEMEN oku
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

    // Token kontrolü yap
    checkAuth();
  }, []);

  // User state değiştiğinde localStorage'a kaydet
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
        // Eğer localStorage'dan user zaten yüklendiyse, backend'e gitme
        if (isInitialized) {
          setIsLoading(false);
          return;
        }

        // Backend'den kullanıcı bilgilerini al
        const userData = await api.getCurrentUser();
        const userInfo = {
          id: userData.id,
          name: `${userData.name} ${userData.surname}`,
          email: userData.email,
          phone: userData.phone_number || undefined,
          username: userData.username,
        };
        setUser(userInfo);
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

      // Token'ı cookie'ye kaydet
      setCookie("auth-token", response.access_token, 7); // 7 gün

      // Token set edildikten sonra kullanıcı bilgilerini backend'den al
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const userData = await api.getCurrentUser();
        const userInfo = {
          id: userData.id,
          name: `${userData.name} ${userData.surname}`,
          email: userData.email,
          phone: userData.phone_number || undefined,
          username: userData.username,
        };
        setUser(userInfo);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await api.register({
        firstName: userData.name,
        lastName: userData.surname,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
      });

      // Token'ı cookie'ye kaydet
      setCookie("auth-token", response.access_token, 7);

      // Token set edildikten sonra kullanıcı bilgilerini state'e kaydet
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (response.user) {
        const userInfo = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone_number,
          username: response.user.username,
        };
        setUser(userInfo);
      }

      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const updateUser = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    try {
      if (!user) {
        throw new Error("User not found");
      }

      const updatedUser = await api.updateProfile({
        name: data.firstName,
        surname: data.lastName,
        username: user.username || "",
        phone_number: data.phone,
        email: user.email,
      });
      const userInfo = {
        id: updatedUser.id,
        name: `${updatedUser.name} ${updatedUser.surname}`,
        email: updatedUser.email,
        phone: updatedUser.phone_number || undefined,
        username: updatedUser.username,
      };
      setUser(userInfo);
    } catch (error) {
      console.error("Update user failed:", error);
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

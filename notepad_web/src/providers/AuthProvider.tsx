"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde token kontrolü
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getCookie("auth-token");
      if (token) {
        // Burada gerçek API çağrısı yapılacak
        // Şimdilik mock data
        const mockUser = {
          id: "1",
          name: "Demo User",
          email: "demo@example.com",
          username: "demouser",
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock login
      const mockToken = "mock-jwt-token-" + Date.now();
      setCookie("auth-token", mockToken, 7); // 7 gün

      const mockUser = {
        id: "1",
        name: "Demo User",
        email: email,
        username: email.split("@")[0],
      };

      setUser(mockUser);

      // Cookie'nin set edilmesi için kısa bir bekleme
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock register
      const mockToken = "mock-jwt-token-" + Date.now();
      setCookie("auth-token", mockToken, 7);

      const mockUser = {
        id: "1",
        name: userData.name + " " + userData.surname,
        email: userData.email,
        username: userData.username,
      };

      setUser(mockUser);

      // Cookie'nin set edilmesi için kısa bir bekleme
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
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

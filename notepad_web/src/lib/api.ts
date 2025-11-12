//const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
  ApiError,
} from "@/types";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const publicEndpoints = ["/auth/user/login/", "/auth/user/register/"];
    if (token && !publicEndpoints.includes(endpoint)) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          
          throw new Error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
        }

        const error: ApiError = await response.json();
        throw new Error(error.detail || "Bir hata oluştu");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Beklenmeyen bir hata oluştu");
    }
  }

  private getToken(): string | null {
    if (typeof document === "undefined") return null;
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="));
    return cookie ? cookie.split("=")[1] : null;
  }

  private clearToken(): void {
    if (typeof document === "undefined") return;
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append("username", data.email);
    formData.append("password", data.password);

    const url = `${this.baseUrl}/auth/user/login/`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.detail || "Giriş başarısız");
    }

    return await response.json();
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const registerResponse = await this.request<UserResponse>(
      "/auth/user/register/",
      {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password_hash: data.password,
          name: data.firstName,
          surname: data.lastName,
          username: data.username,
          phone_number: data.phone || null,
        }),
      }
    );

    const loginResponse = await this.login({
      email: data.email,
      password: data.password,
    });

    return {
      ...loginResponse,
      user: {
        id: registerResponse.id,
        email: registerResponse.email,
        name: `${registerResponse.name} ${registerResponse.surname}`,
        surname: registerResponse.surname,
        username: registerResponse.username,
        phone_number: registerResponse.phone_number || undefined,
      },
    };
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/users/me");
  }

  async updateProfile(data: {
    name: string;
    surname: string;
    username: string;
    phone_number: string;
    email: string;
  }): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/users/update-user/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: {
    current_password: string;
    new_password: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/users/reset-password-in-profile", {
      method: "PUT",
      body: JSON.stringify({
        old_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.new_password,
      }),
    });
  }

  async resetPassword(data: {
      otp: string;
      new_password: string;
      confirm_new_password: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/users/reset-password", {
      method: "POST",
      body: JSON.stringify({
        otp: data.otp,
        new_password: data.new_password,
        confirm_new_password: data.confirm_new_password,
      }),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>("/auth/users/logout/", {
        method: "POST",
      });
    } finally {
      this.clearToken();
    }
  }

  async getNotes(): Promise<any[]> {
    try {
      const response = await this.request<any[]>("/notes/notes/get-all-notes/");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error instanceof Error && (error.message.toLowerCase().includes("empty") || error.message.toLowerCase().includes("database"))) {
        return [];
      }
      throw error;
    }
  }

  async createNote(data: {
    title: string;
    content: string;
    tags?: string[];
    priority?: "Low" | "Medium" | "High";
    is_feature_note?: boolean;
    feature_date?: string;
  }): Promise<any> {
    return this.request<any>("/notes/notes/create-note/", {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        priority: data.priority || "Low",
        is_feature_note: data.is_feature_note || false,
        feature_date: data.feature_date || new Date().toISOString(),
        tags: data.tags || [],
      }),
    });
  }

  async updateNote(
    id: number,
    data: { 
      title?: string; 
      content?: string; 
      tags?: string[];
      priority?: "Low" | "Medium" | "High";
    }
  ): Promise<any> {
    return this.request<any>(`/notes/notes/update-note/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteNote(id: number): Promise<void> {
    return this.request<void>(`/notes/notes/delete/${id}`, {
      method: "DELETE",
    });
  }

  async deleteSelectedNotes(ids: number[]): Promise<void> {
    return this.request<void>("/notes/notes/delete-selected-notes", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  }

  async togglePinNote(id: number): Promise<any> {
    return this.request<any>(`/notes/notes/toggle-pin/${id}`, {
      method: "PATCH",
    });
  }

  async archiveNote(id: number): Promise<any> {
    return this.request<any>(`/notes/notes/archive/${id}`, {
      method: "POST",
    });
  }

  async addToFavorite(id: number): Promise<any> {
    return this.request<any>(`/notes/notes/add-to-favorite/${id}`, {
      method: "POST",
    });
  }

  async searchNotes(query: string): Promise<any[]> {
    if (!query.trim()) return [];
    return this.request<any[]>(`/notes/notes/search/?query=${encodeURIComponent(query)}`);
  }

  async getPinnedNotes(): Promise<any[]> {
    try {
      const response = await this.request<any[]>("/notes/notes/get-pinned-notes");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error instanceof Error && (error.message.toLowerCase().includes("empty") || error.message.toLowerCase().includes("database"))) {
        return [];
      }
      throw error;
    }
  }

  async getFutureNotes(): Promise<any[]> {
    try {
      const response = await this.request<any[]>("/notes/notes/get-all-feature-notes");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error instanceof Error && (error.message.toLowerCase().includes("empty") || error.message.toLowerCase().includes("database"))) {
        return [];
      }
      throw error;
    }
  }

  async getTags(): Promise<any[]> {
    try {
      const response = await this.request<any[]>("/tags/tag/get-all-tags");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      if (error instanceof Error && (error.message.toLowerCase().includes("empty") || error.message.toLowerCase().includes("database"))) {
        return [];
      }
      throw error;
    }
  }

  async createTag(name: string): Promise<any> {
    return this.request<any>("/tags/tag/create", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  async updateTag(id: number, name: string): Promise<any> {
    return this.request<any>(`/tags/tag/update-tag/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
  }

  async deleteTag(id: number): Promise<void> {
    return this.request<void>(`/tags/tag/delete/${id}`, {
      method: "DELETE",
    });
  }

  async addTagToNote(noteId: number, tagId: number): Promise<any> {
    return this.request<any>(`/notes/notes/${noteId}/tags/${tagId}`, {
      method: "POST",
    });
  }

  async addTagToNoteByName(noteId: number, tagName: string): Promise<any> {
    const tags = await this.getTags();
    let tag = tags.find((t: any) => t.name === tagName);
    
    if (!tag) {
      tag = await this.createTag(tagName);
    }
    return this.addTagToNote(noteId, tag.id);
  }
}

export const api = new ApiClient(API_URL);
export const apiClient = api; 

export async function getNotesServerSide(token: string): Promise<any[]> {
  try {
    const url = `${API_URL}/notes/notes/get-all-notes/`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store', 
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Failed to fetch notes");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unauthorized")) {
      throw error;
    }
    return [];
  }
}

export async function getUserServerSide(token: string): Promise<any | null> {
  try {
    const url = `${API_URL}/auth/users/me`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Failed to fetch user");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unauthorized")) {
      throw error;
    }
    return null;
  }
}

export async function getTagsServerSide(token: string): Promise<any[]> {
  try {
    const url = `${API_URL}/tags/tag/get-all-tags`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Failed to fetch tags");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unauthorized")) {
      throw error;
    }
    return [];
  }
}

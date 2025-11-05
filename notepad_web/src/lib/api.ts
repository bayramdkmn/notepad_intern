const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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

export interface ApiError {
  detail: string;
}

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

    // Login ve register dışındaki tüm endpoint'lere token ekle
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

  // Auth endpoints
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
    // Önce kullanıcıyı kaydet
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

    // Sonra otomatik login yap
    const loginResponse = await this.login({
      email: data.email,
      password: data.password,
    });

    // User bilgisini ekle
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
    return this.request<{ message: string }>("/auth/users/reset-password/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>("/auth/users/logout/", {
      method: "POST",
    });
  }

  // Notes endpoints
  async getNotes(): Promise<any[]> {
    try {
      const response = await this.request<any[]>("/notes/notes/get-all-notes/");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      // Eğer "Empty" veya "empty" hatası geliyorsa, boş array dön
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
  }): Promise<any> {
    return this.request<any>("/notes/notes/create-note/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateNote(
    id: number,
    data: { title?: string; content?: string; tags?: string[] }
  ): Promise<any> {
    return this.request<any>(`/notes/notes/update-note/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteNote(id: number): Promise<void> {
    return this.request<void>(`/notes/notes/delete/${id}`, {
      method: "DELETE",
    });
  }

  async togglePinNote(id: number): Promise<any> {
    return this.request<any>(`/notes/notes/toggle-pin/${id}`, {
      method: "POST",
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
    return this.request<any[]>(`/notes/notes/search/?q=${encodeURIComponent(query)}`);
  }

  // Tags endpoints
  async getTags(): Promise<any[]> {
    try {
      const response = await this.request<any[]>("/tags/tag/get-all-tags");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      // Eğer "Empty" veya "empty" hatası geliyorsa, boş array dön
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
}

export const api = new ApiClient(API_URL);

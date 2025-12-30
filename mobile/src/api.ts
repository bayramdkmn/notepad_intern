const DEFAULT_BASE_URL = "http://127.0.0.1:8000/";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  DEFAULT_BASE_URL;

const normalize = (value: string) => value.replace(/\/+$/, "");

const buildUrl = (path = "") => {
  const base = normalize(API_BASE_URL);
  const cleanPath = path.replace(/^\/+/, "");
  return cleanPath ? `${base}/${cleanPath}` : base;
};

type QueryValue = string | number | boolean | undefined | null;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestConfig<TBody> = {
  path: string;
  method?: HttpMethod;
  query?: Record<string, QueryValue>;
  body?: TBody;
  headers?: Record<string, string>;
};

const applyQuery = (urlString: string, query?: RequestConfig<unknown>["query"]) => {
  if (!query) return urlString;
  const url = new URL(urlString);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
};

export async function apiRequest<TResponse = unknown, TBody = unknown>({
  path,
  method = "GET",
  query,
  body,
  headers,
}: RequestConfig<TBody>) {
  const target = applyQuery(buildUrl(path), query);
  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
  };

  if (body && method !== "GET") {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(target, init);
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = "API request failed";
    
    if (isJson && typeof payload === "object" && payload !== null) {
      const errorData = payload as any;
      if (errorData.detail) {
        if (typeof errorData.detail === "string") {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail
            .map((err: any) => err.msg || JSON.stringify(err))
            .join(", ");
        } else {
          errorMessage = JSON.stringify(errorData.detail);
        }
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } else if (typeof payload === "string") {
      errorMessage = payload;
    }
    
    throw {
      status: response.status,
      data: payload,
      message: errorMessage,
    };
  }

  return payload as TResponse;
}

export const login = async (data: { email: string; password: string }) => {
  const form = new URLSearchParams();
  form.append("username", data.email);
  form.append("password", data.password);

  try {
    const response = await apiRequest<any, string>({
      path: "/auth/user/login/",
      method: "POST",
      body: form.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response;
  } catch (error: any) {
    if (error?.message) {
      return error;
    } 
  }
};

export const register = (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  phone?: string;
  role?: string;
}) =>
  apiRequest<any>({
    path: "/auth/user/register/",
    method: "POST",
    body: {
      email: data.email,
      password_hash: data.password,
      name: data.firstName,
      surname: data.lastName,
      username: data.username,
      phone_number: data.phone ?? null,
      role: data.role ?? "user",
    },
  });

export const logout = (token: string) =>
  apiRequest<void>({
    path: "/auth/users/logout/",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const resetPassword = (data: {
  otp: string;
  new_password: string;
  confirm_new_password: string;
}) =>
  apiRequest<{ message: string }>({
    path: "/auth/users/reset-password",
    method: "POST",
    body: data,
  });

// Notlar
export const fetchNotes = (token: string) =>
  apiRequest<any[]>({
    path: "/notes/notes/get-all-notes/",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createNote = (
  token: string,
  data: {
    title: string;
    content: string;
    tags?: string[];
    priority?: "Low" | "Medium" | "High";
    is_feature_note?: boolean;
    feature_date?: string;
  }
) =>
  apiRequest<any>({
    path: "/notes/notes/create-note/",
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      title: data.title,
      content: data.content,
      priority: data.priority ?? "Low",
      is_feature_note: data.is_feature_note ?? false,
      feature_date: data.feature_date ?? new Date().toISOString(),
      tags: data.tags ?? [],
    },
  });
  
export const pinnedNote = async (
  token: string,
  noteId: number
) => {
  try {
    const response = await apiRequest<any>({
      path: `/notes/notes/toggle-pin/${noteId}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Pinned Note Error:", error);
    throw error;
  }
};


export const deleteNote = async (token:string,noteId: number) => {
  return apiRequest<void>({
    path: `/notes/notes/delete/${noteId}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Etiketler
export const getAllTagsByUser = async (token:string) => {
  try {
    const response = await apiRequest<any[]>({
      path:"/tags/tag/get-all-tags",
      method:"GET",
      headers:{
        Authorization: `Bearer ${token}`,
      },
    });
    return response; 
  } catch (error) {
    console.error("Get All Tags Error:", error);
    throw error;
  }
}

export const deleteTag = async (token:string,tag_id: number) => {
  return apiRequest<void>({
    path: `/tags/tag/delete/${tag_id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const updateTag = async (
  token:string,
  tag_id: number,
  name: string,) => {
  return apiRequest<any>({
    path: `/tags/tag/update-tag/${tag_id}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      name,
    },
  });
}
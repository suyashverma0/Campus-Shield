/**
 * Centralized API Service Layer for Campus Shield
 * Connects React Frontend to Node.js/Express Backend and MongoDB Atlas
 */

export const BACKEND_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
  "http://localhost:5000";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  `${BACKEND_URL}/api`;

const STORAGE_KEYS = {
  ITEMS: "campus_shield_items",
  MATCHES: "campus_shield_matches",
  USERS: "campus_shield_users",
  CURRENT_USER: "campus_shield_current_user",
  TOKEN: "campus_shield_auth_token",
  MESSAGES: "campus_shield_messages",
};

// Helper to resolve uploaded images or presets to full URLs
export function resolveImageUrl(imagePath, fallback = "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600") {
  if (!imagePath) return fallback;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  if (imagePath.startsWith("/uploads/")) {
    return `${BACKEND_URL}${imagePath}`;
  }
  if (imagePath.startsWith("uploads/")) {
    return `${BACKEND_URL}/${imagePath}`;
  }
  return imagePath;
}

export function getAuthToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
}

export function removeAuthToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

/**
 * Standard HTTP Request Wrapper for Backend APIs
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Do not set Content-Type if body is FormData (let browser set boundary)
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, config);
    let data = null;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: text };
    }

    if (!res.ok) {
      if (res.status === 401) {
        // Clear invalid token
        removeAuthToken();
      }
      const errorMsg = data?.message || data?.errors?.join?.(", ") || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data?.data !== undefined ? data.data : data;
  } catch (err) {
    console.error(`[API Error] ${options.method || "GET"} ${url}:`, err.message);
    throw err;
  }
}

// Fallback & Compatibility layer
export const simulateDelay = (ms = 120) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class ApiClient {
  static get(key, defaultData) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultData;
    } catch (err) {
      console.error(`Error reading ${key} from storage:`, err);
      return defaultData;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving ${key} to storage:`, err);
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Error removing ${key}:`, err);
    }
  }
}

export { STORAGE_KEYS };

/**
 * Centralized API Service Layer
 * Designed to mock network requests with realistic async latency and localStorage persistence,
 * with clean interfaces ready for backend integration (Express, FastAPI, Supabase, etc.)
 */

const STORAGE_KEYS = {
  ITEMS: "campus_shield_items",
  MATCHES: "campus_shield_matches",
  USERS: "campus_shield_users",
  CURRENT_USER: "campus_shield_current_user",
  MESSAGES: "campus_shield_messages"
};

// Simulated network delay in ms
const NETWORK_DELAY = 120;

export const simulateDelay = (ms = NETWORK_DELAY) =>
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

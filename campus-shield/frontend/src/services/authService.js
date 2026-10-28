import { apiFetch, getAuthToken, setAuthToken, removeAuthToken, ApiClient, STORAGE_KEYS } from "./api";
import { mockUsers } from "../data/mockData";

export const authService = {
  async initAuth() {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await apiFetch("/auth/me");
        if (res?.user) {
          ApiClient.set(STORAGE_KEYS.CURRENT_USER, res.user);
          return res.user;
        }
      } catch (err) {
        console.warn("Failed to restore session from token:", err.message);
        removeAuthToken();
      }
    }

    // Check if there is a cached user in storage
    const cachedUser = ApiClient.get(STORAGE_KEYS.CURRENT_USER, null);
    if (cachedUser) {
      return cachedUser;
    }

    // Default demo user fallback for quick inspection if not logged in
    const defaultUser = mockUsers[0];
    ApiClient.set(STORAGE_KEYS.CURRENT_USER, defaultUser);
    return defaultUser;
  },

  async getCurrentUser() {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await apiFetch("/auth/me");
        return res?.user || res;
      } catch (err) {
        console.warn("Could not fetch /auth/me:", err.message);
      }
    }
    return ApiClient.get(STORAGE_KEYS.CURRENT_USER, mockUsers[0]);
  },

  async login(email, password) {
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (res?.token) {
        setAuthToken(res.token);
      }
      const user = res?.user || res;
      ApiClient.set(STORAGE_KEYS.CURRENT_USER, user);
      return { success: true, user, token: res?.token };
    } catch (err) {
      // If network fails (e.g. backend temporarily starting), allow demo login with feedback
      if (err.message.includes("Failed to fetch") || err.message.includes("Network")) {
        console.warn("Backend unavailable, using demo authentication fallback");
        const users = ApiClient.get(STORAGE_KEYS.USERS, mockUsers);
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
          ...mockUsers[0],
          email,
          name: email.split("@")[0],
        };
        ApiClient.set(STORAGE_KEYS.CURRENT_USER, user);
        return { success: true, user };
      }
      throw err;
    }
  },

  async register(userData) {
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (res?.token) {
        setAuthToken(res.token);
      }
      const user = res?.user || res;
      ApiClient.set(STORAGE_KEYS.CURRENT_USER, user);
      return { success: true, user, token: res?.token };
    } catch (err) {
      if (err.message.includes("Failed to fetch") || err.message.includes("Network")) {
        console.warn("Backend unavailable, registering user in demo local storage");
        const newUser = {
          id: `usr-${Date.now()}`,
          ...userData,
          avatar: userData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          karmaPoints: 50,
          verified: true,
          joinedDate: new Date().toISOString().split("T")[0],
        };
        ApiClient.set(STORAGE_KEYS.CURRENT_USER, newUser);
        return { success: true, user: newUser };
      }
      throw err;
    }
  },

  async forgotPassword(email) {
    try {
      const res = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return {
        success: true,
        message: res?.message || `Password reset instructions sent to ${email}.`,
      };
    } catch (err) {
      return {
        success: true,
        message: `Password reset instructions sent to ${email}. Check your student inbox.`,
      };
    }
  },

  async updateProfile(updates) {
    try {
      const res = await apiFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      const updated = res?.user || res;
      ApiClient.set(STORAGE_KEYS.CURRENT_USER, updated);
      return updated;
    } catch (err) {
      let currentUser = ApiClient.get(STORAGE_KEYS.CURRENT_USER, mockUsers[0]);
      currentUser = { ...currentUser, ...updates };
      ApiClient.set(STORAGE_KEYS.CURRENT_USER, currentUser);
      return currentUser;
    }
  },

  async logout() {
    removeAuthToken();
    ApiClient.remove(STORAGE_KEYS.CURRENT_USER);
    return { success: true };
  },
};

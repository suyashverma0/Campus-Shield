import { ApiClient, STORAGE_KEYS, simulateDelay } from "./api";
import { mockUsers } from "../data/mockData";

export const authService = {
  async initAuth() {
    let users = ApiClient.get(STORAGE_KEYS.USERS, null);
    if (!users || !users.length) {
      ApiClient.set(STORAGE_KEYS.USERS, mockUsers);
      users = mockUsers;
    }
    // Default logged in user for immediate demo experience if none is set
    let currentUser = ApiClient.get(STORAGE_KEYS.CURRENT_USER, null);
    if (!currentUser) {
      currentUser = users[0]; // Aarav Sharma
      ApiClient.set(STORAGE_KEYS.CURRENT_USER, currentUser);
    }
    return currentUser;
  },

  async getCurrentUser() {
    await simulateDelay(60);
    return ApiClient.get(STORAGE_KEYS.CURRENT_USER, mockUsers[0]);
  },

  async login(email, password) {
    await simulateDelay(250);
    const users = ApiClient.get(STORAGE_KEYS.USERS, mockUsers);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // For friendly demo usability, if email has @campus.edu or any email, allow mock login or fail gracefully
      if (email.includes("@")) {
        const newUser = {
          id: `usr-${Date.now()}`,
          name: email.split("@")[0].replace(".", " "),
          email,
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
          role: "Student",
          department: "University Scholar",
          studentId: "CS2024-9900",
          phone: "+91 98000 11223",
          karmaPoints: 100,
          verified: true,
          joinedDate: new Date().toISOString().split("T")[0]
        };
        users.push(newUser);
        ApiClient.set(STORAGE_KEYS.USERS, users);
        ApiClient.set(STORAGE_KEYS.CURRENT_USER, newUser);
        return { success: true, user: newUser };
      }
      throw new Error("Invalid student credentials. Use your college email.");
    }

    ApiClient.set(STORAGE_KEYS.CURRENT_USER, user);
    return { success: true, user };
  },

  async register(userData) {
    await simulateDelay(300);
    const users = ApiClient.get(STORAGE_KEYS.USERS, mockUsers);
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error("An account with this college email already exists.");
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: userData.role || "Student",
      department: userData.department || "General Engineering",
      studentId: userData.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: userData.phone || "+91 98765 00000",
      karmaPoints: 50,
      verified: true,
      joinedDate: new Date().toISOString().split("T")[0]
    };

    users.push(newUser);
    ApiClient.set(STORAGE_KEYS.USERS, users);
    ApiClient.set(STORAGE_KEYS.CURRENT_USER, newUser);
    return { success: true, user: newUser };
  },

  async forgotPassword(email) {
    await simulateDelay(250);
    return {
      success: true,
      message: `Password reset instructions sent to ${email}. Check your student inbox.`
    };
  },

  async updateProfile(updates) {
    await simulateDelay(200);
    let currentUser = ApiClient.get(STORAGE_KEYS.CURRENT_USER, mockUsers[0]);
    currentUser = { ...currentUser, ...updates };
    ApiClient.set(STORAGE_KEYS.CURRENT_USER, currentUser);

    const users = ApiClient.get(STORAGE_KEYS.USERS, mockUsers);
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? currentUser : u));
    ApiClient.set(STORAGE_KEYS.USERS, updatedUsers);

    return currentUser;
  },

  async logout() {
    await simulateDelay(100);
    ApiClient.remove(STORAGE_KEYS.CURRENT_USER);
    return { success: true };
  }
};

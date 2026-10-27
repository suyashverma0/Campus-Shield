import { ApiClient, STORAGE_KEYS, simulateDelay } from "./api";
import { mockItems } from "../data/mockData";
import { generateId } from "../utils/helpers";
import { matchService } from "./matchService";

export const itemService = {
  async initItems() {
    let items = ApiClient.get(STORAGE_KEYS.ITEMS, null);
    if (!items || !items.length) {
      ApiClient.set(STORAGE_KEYS.ITEMS, mockItems);
      items = mockItems;
    }
    return items;
  },

  async getItems(params = {}) {
    await simulateDelay(150);
    let items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);

    if (params.type && params.type !== "all") {
      items = items.filter((item) => item.type === params.type);
    }

    if (params.category && params.category !== "all") {
      items = items.filter((item) => item.category === params.category);
    }

    if (params.location && params.location !== "all") {
      items = items.filter((item) => item.location.toLowerCase().includes(params.location.toLowerCase()));
    }

    if (params.status && params.status !== "all") {
      items = items.filter((item) => item.status === params.status);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }

    if (params.userId) {
      items = items.filter((item) => item.userId === params.userId);
    }

    // Sort order: newest first
    items.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    return items;
  },

  async getItemById(id) {
    await simulateDelay(100);
    const items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
    const item = items.find((i) => i.id === id);
    if (!item) {
      throw new Error(`Item with ID ${id} not found.`);
    }
    return item;
  },

  async createItem(itemData, currentUser) {
    await simulateDelay(250);
    const items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
    const prefix = itemData.type === "lost" ? "LOST" : "FND";
    const newItem = {
      id: generateId(prefix),
      ...itemData,
      status: "active",
      userId: currentUser?.id || "usr-01",
      userName: currentUser?.name || "Aarav Sharma",
      userAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      userDepartment: currentUser?.department || "Campus Scholar",
      createdAt: new Date().toISOString()
    };

    items.unshift(newItem);
    ApiClient.set(STORAGE_KEYS.ITEMS, items);

    // Run AI matching algorithm against complementary existing items
    const matchesFound = await matchService.findMatchesForItem(newItem, items);

    return {
      item: newItem,
      matches: matchesFound
    };
  },

  async updateItem(id, updates) {
    await simulateDelay(200);
    const items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Item not found");

    items[index] = { ...items[index], ...updates };
    ApiClient.set(STORAGE_KEYS.ITEMS, items);
    return items[index];
  },

  async deleteItem(id) {
    await simulateDelay(150);
    let items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
    items = items.filter((i) => i.id !== id);
    ApiClient.set(STORAGE_KEYS.ITEMS, items);
    return { success: true };
  },

  async resolveItem(id, resolutionNote = "") {
    await simulateDelay(180);
    const items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Item not found");

    items[index].status = "resolved";
    items[index].resolvedAt = new Date().toISOString();
    items[index].resolutionNote = resolutionNote || "Reunited with verified owner on campus!";
    ApiClient.set(STORAGE_KEYS.ITEMS, items);
    return items[index];
  }
};

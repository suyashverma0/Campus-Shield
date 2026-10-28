import { apiFetch, ApiClient, STORAGE_KEYS, resolveImageUrl } from "./api";
import { mockItems } from "../data/mockData";
import { generateId } from "../utils/helpers";
import { matchService } from "./matchService";

export const itemService = {
  async initItems() {
    try {
      const items = await this.getItems();
      return items;
    } catch {
      let items = ApiClient.get(STORAGE_KEYS.ITEMS, null);
      if (!items || !items.length) {
        ApiClient.set(STORAGE_KEYS.ITEMS, mockItems);
        items = mockItems;
      }
      return items;
    }
  },

  async getItems(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.type && params.type !== "all") queryParams.append("type", params.type);
      if (params.category && params.category !== "all") queryParams.append("category", params.category);
      if (params.location && params.location !== "all") queryParams.append("location", params.location);
      if (params.status && params.status !== "all") queryParams.append("status", params.status);
      if (params.search && params.search.trim()) queryParams.append("search", params.search.trim());
      if (params.userId) queryParams.append("userId", params.userId);

      const qs = queryParams.toString();
      const endpoint = `/items${qs ? `?${qs}` : ""}`;
      const data = await apiFetch(endpoint);

      if (Array.isArray(data)) {
        // Normalize image URLs
        const normalized = data.map((item) => ({
          ...item,
          image: resolveImageUrl(item.image),
        }));
        // Update local cache
        ApiClient.set(STORAGE_KEYS.ITEMS, normalized);
        return normalized;
      }
      return data;
    } catch (err) {
      console.warn("Falling back to local items store due to API error:", err.message);
      let items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);

      if (params.type && params.type !== "all") {
        items = items.filter((item) => item.type === params.type);
      }
      if (params.category && params.category !== "all") {
        items = items.filter((item) => item.category === params.category);
      }
      if (params.location && params.location !== "all") {
        items = items.filter((item) => item.location?.toLowerCase().includes(params.location.toLowerCase()));
      }
      if (params.status && params.status !== "all") {
        items = items.filter((item) => item.status === params.status);
      }
      if (params.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        items = items.filter(
          (item) =>
            item.title?.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            item.location?.toLowerCase().includes(q) ||
            item.brand?.toLowerCase().includes(q) ||
            item.category?.toLowerCase().includes(q)
        );
      }
      if (params.userId) {
        items = items.filter((item) => item.userId === params.userId);
      }

      items.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      return items;
    }
  },

  async getItemById(id) {
    try {
      const data = await apiFetch(`/items/${id}`);
      return {
        ...data,
        image: resolveImageUrl(data.image),
      };
    } catch (err) {
      console.warn(`Local fallback for getItemById(${id}):`, err.message);
      const items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
      const item = items.find((i) => i.id === id || i.rawId === id);
      if (!item) {
        throw new Error(`Item with ID ${id} not found.`);
      }
      return item;
    }
  },

  async createItem(itemData, currentUser) {
    try {
      let body;
      // If image is a File or Blob, send FormData
      if (itemData.imageFile instanceof File || itemData.imageFile instanceof Blob) {
        body = new FormData();
        Object.keys(itemData).forEach((key) => {
          if (key === "imageFile") {
            body.append("image", itemData.imageFile);
          } else if (itemData[key] !== undefined && itemData[key] !== null) {
            body.append(key, itemData[key]);
          }
        });
      } else {
        body = JSON.stringify(itemData);
      }

      const res = await apiFetch("/items", {
        method: "POST",
        body,
      });

      const newItem = {
        ...res.item,
        image: resolveImageUrl(res.item?.image),
      };

      const matches = (res.matches || []).map((m) => ({
        ...m,
        lostItem: m.lostItem ? { ...m.lostItem, image: resolveImageUrl(m.lostItem.image) } : null,
        foundItem: m.foundItem ? { ...m.foundItem, image: resolveImageUrl(m.foundItem.image) } : null,
      }));

      // Update local storage cache
      const cached = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
      ApiClient.set(STORAGE_KEYS.ITEMS, [newItem, ...cached]);

      return {
        item: newItem,
        matches,
      };
    } catch (err) {
      console.warn("Using offline fallback for item creation:", err.message);
      const items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
      const prefix = itemData.type === "lost" ? "LOST" : "FND";
      const newItem = {
        id: generateId(prefix),
        ...itemData,
        status: "active",
        userId: currentUser?.id || "usr-01",
        userName: currentUser?.name || "Campus Scholar",
        userAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        userDepartment: currentUser?.department || "Campus Scholar",
        createdAt: new Date().toISOString(),
      };

      items.unshift(newItem);
      ApiClient.set(STORAGE_KEYS.ITEMS, items);

      const matchesFound = await matchService.findMatchesForItem(newItem, items);

      return {
        item: newItem,
        matches: matchesFound,
      };
    }
  },

  async updateItem(id, updates) {
    try {
      const res = await apiFetch(`/items/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      return {
        ...res,
        image: resolveImageUrl(res?.image),
      };
    } catch (err) {
      const items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
      const index = items.findIndex((i) => i.id === id || i.rawId === id);
      if (index === -1) throw new Error("Item not found");

      items[index] = { ...items[index], ...updates };
      ApiClient.set(STORAGE_KEYS.ITEMS, items);
      return items[index];
    }
  },

  async deleteItem(id) {
    try {
      await apiFetch(`/items/${id}`, { method: "DELETE" });
      const items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems).filter(
        (i) => i.id !== id && i.rawId !== id
      );
      ApiClient.set(STORAGE_KEYS.ITEMS, items);
      return { success: true };
    } catch (err) {
      let items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
      items = items.filter((i) => i.id !== id && i.rawId !== id);
      ApiClient.set(STORAGE_KEYS.ITEMS, items);
      return { success: true };
    }
  },

  async resolveItem(id, resolutionNote = "") {
    try {
      const res = await apiFetch(`/items/${id}/resolve`, {
        method: "POST",
        body: JSON.stringify({ resolutionNote }),
      });
      return {
        ...res,
        image: resolveImageUrl(res?.image),
      };
    } catch (err) {
      const items = ApiClient.get(STORAGE_KEYS.ITEMS, mockItems);
      const index = items.findIndex((i) => i.id === id || i.rawId === id);
      if (index === -1) throw new Error("Item not found");

      items[index].status = "resolved";
      items[index].resolvedAt = new Date().toISOString();
      items[index].resolutionNote = resolutionNote || "Reunited with verified owner on campus!";
      ApiClient.set(STORAGE_KEYS.ITEMS, items);
      return items[index];
    }
  },
};

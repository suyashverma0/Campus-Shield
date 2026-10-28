import { apiFetch, ApiClient, STORAGE_KEYS } from "./api";
import { mockMessages } from "../data/mockData";
import { generateId } from "../utils/helpers";

export const messageService = {
  async initMessages() {
    try {
      const threads = await this.getThreads();
      return threads;
    } catch {
      let threads = ApiClient.get(STORAGE_KEYS.MESSAGES, null);
      if (!threads || !threads.length) {
        ApiClient.set(STORAGE_KEYS.MESSAGES, mockMessages);
        threads = mockMessages;
      }
      return threads;
    }
  },

  async getThreads(userId = "usr-01") {
    try {
      const data = await apiFetch("/messages");
      if (Array.isArray(data) && data.length > 0) {
        ApiClient.set(STORAGE_KEYS.MESSAGES, data);
        return data;
      }
      return data?.length ? data : ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
    } catch (err) {
      console.warn("Using local threads store:", err.message);
      return ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
    }
  },

  async getThreadById(threadId) {
    try {
      const data = await apiFetch(`/messages/${threadId}`);
      return data;
    } catch (err) {
      const threads = ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
      const thread = threads.find((t) => t.id === threadId || t.rawId === threadId);
      if (!thread) throw new Error("Thread not found");
      return thread;
    }
  },

  async sendMessage(threadId, text, senderId = "usr-01") {
    try {
      const newMsg = await apiFetch(`/messages/${threadId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      return newMsg;
    } catch (err) {
      const threads = ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
      const thread = threads.find((t) => t.id === threadId || t.rawId === threadId);
      if (!thread) throw new Error("Thread not found");

      const newMsg = {
        id: generateId("msg"),
        senderId,
        text,
        timestamp: new Date().toISOString(),
      };

      thread.messages.push(newMsg);
      thread.lastActivity = new Date().toISOString();
      ApiClient.set(STORAGE_KEYS.MESSAGES, threads);
      return newMsg;
    }
  },

  async createOrGetThread(participant, item) {
    try {
      const thread = await apiFetch("/messages/thread", {
        method: "POST",
        body: JSON.stringify({ participant, item }),
      });
      return thread;
    } catch (err) {
      const threads = ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
      const participantId = participant.id || participant._id;
      const itemId = item.id || item._id;

      let existing = threads.find(
        (t) => (t.participantId === participantId || t.participantId === participant.name) &&
               (t.relatedItemId === itemId || t.relatedItemTitle === item.title)
      );

      if (existing) {
        return existing;
      }

      const newThread = {
        id: generateId("thread"),
        participantId: participantId,
        participantName: participant.name,
        participantAvatar: participant.avatar,
        participantRole: participant.department || "Student",
        relatedItemId: itemId,
        relatedItemTitle: item.title,
        unreadCount: 0,
        lastActivity: new Date().toISOString(),
        messages: [
          {
            id: generateId("m"),
            senderId: "usr-01",
            text: `Hi ${participant.name}! Inquiring regarding "${item.title}" reported on Campus Shield.`,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      threads.unshift(newThread);
      ApiClient.set(STORAGE_KEYS.MESSAGES, threads);
      return newThread;
    }
  },

  async markThreadRead(threadId) {
    try {
      await apiFetch(`/messages/${threadId}/read`, { method: "PUT" });
    } catch {
      // Local fallback
    }
    const threads = ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
    const thread = threads.find((t) => t.id === threadId || t.rawId === threadId);
    if (thread) {
      thread.unreadCount = 0;
      ApiClient.set(STORAGE_KEYS.MESSAGES, threads);
    }
  },
};

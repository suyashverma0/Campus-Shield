import { ApiClient, STORAGE_KEYS, simulateDelay } from "./api";
import { mockMessages, mockUsers } from "../data/mockData";
import { generateId } from "../utils/helpers";

export const messageService = {
  async initMessages() {
    let threads = ApiClient.get(STORAGE_KEYS.MESSAGES, null);
    if (!threads || !threads.length) {
      ApiClient.set(STORAGE_KEYS.MESSAGES, mockMessages);
      threads = mockMessages;
    }
    return threads;
  },

  async getThreads(userId = "usr-01") {
    await simulateDelay(100);
    const threads = ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
    return threads;
  },

  async getThreadById(threadId) {
    await simulateDelay(80);
    const threads = ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) throw new Error("Thread not found");
    return thread;
  },

  async sendMessage(threadId, text, senderId = "usr-01") {
    await simulateDelay(120);
    const threads = ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) throw new Error("Thread not found");

    const newMsg = {
      id: generateId("msg"),
      senderId,
      text,
      timestamp: new Date().toISOString()
    };

    thread.messages.push(newMsg);
    thread.lastActivity = new Date().toISOString();
    ApiClient.set(STORAGE_KEYS.MESSAGES, threads);
    return newMsg;
  },

  async createOrGetThread(participant, item) {
    await simulateDelay(150);
    const threads = ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
    let existing = threads.find(
      (t) => t.participantId === participant.id && t.relatedItemId === item.id
    );

    if (existing) {
      return existing;
    }

    const newThread = {
      id: generateId("thread"),
      participantId: participant.id,
      participantName: participant.name,
      participantAvatar: participant.avatar,
      participantRole: participant.department || "Student",
      relatedItemId: item.id,
      relatedItemTitle: item.title,
      unreadCount: 0,
      lastActivity: new Date().toISOString(),
      messages: [
        {
          id: generateId("m"),
          senderId: "usr-01",
          text: `Hi ${participant.name}! Inquiring regarding "${item.title}" reported on Campus Shield.`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    threads.unshift(newThread);
    ApiClient.set(STORAGE_KEYS.MESSAGES, threads);
    return newThread;
  },

  async markThreadRead(threadId) {
    const threads = ApiClient.get(STORAGE_KEYS.MESSAGES, mockMessages);
    const thread = threads.find((t) => t.id === threadId);
    if (thread) {
      thread.unreadCount = 0;
      ApiClient.set(STORAGE_KEYS.MESSAGES, threads);
    }
  }
};

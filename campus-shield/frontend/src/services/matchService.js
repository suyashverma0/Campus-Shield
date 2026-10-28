import { apiFetch, ApiClient, STORAGE_KEYS, resolveImageUrl } from "./api";
import { mockMatches } from "../data/mockData";
import { calculateMatchScore, generateId } from "../utils/helpers";

function normalizeMatch(match) {
  if (!match) return match;
  return {
    ...match,
    lostItem: match.lostItem
      ? { ...match.lostItem, image: resolveImageUrl(match.lostItem.image) }
      : null,
    foundItem: match.foundItem
      ? { ...match.foundItem, image: resolveImageUrl(match.foundItem.image) }
      : null,
  };
}

export const matchService = {
  async initMatches() {
    try {
      const matches = await this.getMatches();
      return matches;
    } catch {
      let matches = ApiClient.get(STORAGE_KEYS.MATCHES, null);
      if (!matches || !matches.length) {
        ApiClient.set(STORAGE_KEYS.MATCHES, mockMatches);
        matches = mockMatches;
      }
      return matches;
    }
  },

  async getMatches(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.status && params.status !== "all") queryParams.append("status", params.status);
      if (params.userId) queryParams.append("userId", params.userId);

      const qs = queryParams.toString();
      const endpoint = `/matches${qs ? `?${qs}` : ""}`;
      const data = await apiFetch(endpoint);

      if (Array.isArray(data)) {
        const normalized = data.map(normalizeMatch);
        ApiClient.set(STORAGE_KEYS.MATCHES, normalized);
        return normalized;
      }
      return data;
    } catch (err) {
      console.warn("Falling back to local matches store:", err.message);
      let matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);

      if (params.status && params.status !== "all") {
        matches = matches.filter((m) => m.status === params.status);
      }
      if (params.userId) {
        matches = matches.filter(
          (m) => m.lostItem?.userId === params.userId || m.foundItem?.userId === params.userId
        );
      }
      return matches;
    }
  },

  async getMatchById(id) {
    try {
      const data = await apiFetch(`/matches/${id}`);
      return normalizeMatch(data);
    } catch (err) {
      const matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
      const match = matches.find((m) => m.id === id || m.rawId === id);
      if (!match) throw new Error("Match not found");
      return normalizeMatch(match);
    }
  },

  async findMatchesForItem(targetItem, allItems) {
    const isLost = targetItem.type === "lost";
    const candidates = allItems.filter(
      (item) => item.type !== targetItem.type && item.status !== "resolved" && item.id !== targetItem.id
    );

    const matchesList = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
    const newMatches = [];

    for (const candidate of candidates) {
      const lostItem = isLost ? targetItem : candidate;
      const foundItem = isLost ? candidate : targetItem;

      const { score, factors } = calculateMatchScore(lostItem, foundItem);

      if (score >= 50) {
        const matchObj = {
          id: generateId("MATCH"),
          score,
          status: "suggested",
          lostItem: { ...lostItem, image: resolveImageUrl(lostItem.image) },
          foundItem: { ...foundItem, image: resolveImageUrl(foundItem.image) },
          matchDate: new Date().toISOString(),
          factors: factors.map((f) => ({
            label: `${f.label}`,
            score: `+${f.points}%`,
          })),
          verified: false,
          mutualApproved: false,
        };

        newMatches.push(matchObj);
        matchesList.unshift(matchObj);
      }
    }

    if (newMatches.length > 0) {
      ApiClient.set(STORAGE_KEYS.MATCHES, matchesList);
    }

    return newMatches;
  },

  async verifyMatch(id) {
    try {
      const updated = await apiFetch(`/matches/${id}/verify`, { method: "POST" });
      const norm = normalizeMatch(updated);
      const matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
      ApiClient.set(
        STORAGE_KEYS.MATCHES,
        matches.map((m) => (m.id === id || m.rawId === id ? norm : m))
      );
      return norm;
    } catch (err) {
      const matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
      const match = matches.find((m) => m.id === id || m.rawId === id);
      if (!match) throw new Error("Match not found");

      match.verified = true;
      match.status = "verified";
      ApiClient.set(STORAGE_KEYS.MATCHES, matches);
      return match;
    }
  },

  async confirmMatch(id) {
    try {
      const updated = await apiFetch(`/matches/${id}/confirm`, { method: "POST" });
      const norm = normalizeMatch(updated);
      const matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
      ApiClient.set(
        STORAGE_KEYS.MATCHES,
        matches.map((m) => (m.id === id || m.rawId === id ? norm : m))
      );
      return norm;
    } catch (err) {
      const matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
      const match = matches.find((m) => m.id === id || m.rawId === id);
      if (!match) throw new Error("Match not found");

      match.mutualApproved = true;
      match.status = "reunited";
      ApiClient.set(STORAGE_KEYS.MATCHES, matches);
      return match;
    }
  },

  async dismissMatch(id) {
    try {
      await apiFetch(`/matches/${id}`, { method: "DELETE" });
    } catch {
      // Local fallback
    }
    let matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
    matches = matches.filter((m) => m.id !== id && m.rawId !== id);
    ApiClient.set(STORAGE_KEYS.MATCHES, matches);
    return { success: true };
  },
};

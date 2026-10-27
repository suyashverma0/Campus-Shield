import { ApiClient, STORAGE_KEYS, simulateDelay } from "./api";
import { mockMatches } from "../data/mockData";
import { calculateMatchScore, generateId } from "../utils/helpers";

export const matchService = {
  async initMatches() {
    let matches = ApiClient.get(STORAGE_KEYS.MATCHES, null);
    if (!matches || !matches.length) {
      ApiClient.set(STORAGE_KEYS.MATCHES, mockMatches);
      matches = mockMatches;
    }
    return matches;
  },

  async getMatches(params = {}) {
    await simulateDelay(120);
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
  },

  async getMatchById(id) {
    await simulateDelay(80);
    const matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
    const match = matches.find((m) => m.id === id);
    if (!match) throw new Error("Match not found");
    return match;
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
          lostItem,
          foundItem,
          matchDate: new Date().toISOString(),
          factors: factors.map((f) => ({
            label: `${f.label}`,
            score: `+${f.points}%`
          })),
          verified: false,
          mutualApproved: false
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
    await simulateDelay(150);
    const matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
    const match = matches.find((m) => m.id === id);
    if (!match) throw new Error("Match not found");

    match.verified = true;
    match.status = "verified";
    ApiClient.set(STORAGE_KEYS.MATCHES, matches);
    return match;
  },

  async confirmMatch(id) {
    await simulateDelay(200);
    const matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
    const match = matches.find((m) => m.id === id);
    if (!match) throw new Error("Match not found");

    match.mutualApproved = true;
    match.status = "reunited";
    ApiClient.set(STORAGE_KEYS.MATCHES, matches);
    return match;
  },

  async dismissMatch(id) {
    await simulateDelay(100);
    let matches = ApiClient.get(STORAGE_KEYS.MATCHES, mockMatches);
    matches = matches.filter((m) => m.id !== id);
    ApiClient.set(STORAGE_KEYS.MATCHES, matches);
    return { success: true };
  }
};

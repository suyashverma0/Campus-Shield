import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { itemService } from "../services/itemService";
import { matchService } from "../services/matchService";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { mockStats } from "../data/mockData";

const ItemContext = createContext(null);

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    location: "all",
    status: "all"
  });

  const { currentUser } = useAuth();
  const toast = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await itemService.initItems();
      await matchService.initMatches();

      const [loadedItems, loadedMatches] = await Promise.all([
        itemService.getItems(),
        matchService.getMatches()
      ]);

      setItems(loadedItems);
      setMatches(loadedMatches);

      // Dynamically compute stats from real items
      const totalLost = loadedItems.filter((i) => i.type === "lost" && i.status !== "resolved").length;
      const totalFound = loadedItems.filter((i) => i.type === "found" && i.status !== "resolved").length;
      const resolved = loadedItems.filter((i) => i.status === "resolved").length;

      setStats({
        ...mockStats,
        totalReported: loadedItems.length,
        activeLost: totalLost,
        activeFound: totalFound,
        reunitedItems: mockStats.reunitedItems + resolved
      });
    } catch (err) {
      console.error("Error loading items/matches:", err);
      toast.error("Network Error", "Could not synchronize campus items.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const reportItem = async (itemData) => {
    try {
      const res = await itemService.createItem(itemData, currentUser);
      setItems((prev) => [res.item, ...prev]);

      if (res.matches && res.matches.length > 0) {
        setMatches((prev) => [...res.matches, ...prev]);
        toast.matchAlert(
          "Potential Match Detected!",
          `AI found ${res.matches.length} matching report(s) on campus! Check your matches.`
        );

        // Confetti celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        toast.success(
          "Report Published",
          `Your ${itemData.type === "lost" ? "Lost" : "Found"} item report has been logged to the campus bulletin.`
        );
      }

      return res;
    } catch (err) {
      toast.error("Submission Failed", err.message);
      throw err;
    }
  };

  const resolveItem = async (id, note) => {
    try {
      const updated = await itemService.resolveItem(id, note);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      toast.success("Item Marked Reunited!", "Campus Shield karma points awarded!");

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      return updated;
    } catch (err) {
      toast.error("Action Failed", err.message);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      await itemService.deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.info("Report Removed", "Item listing deleted.");
    } catch (err) {
      toast.error("Error", err.message);
      throw err;
    }
  };

  const verifyMatch = async (matchId) => {
    try {
      const updated = await matchService.verifyMatch(matchId);
      setMatches((prev) => prev.map((m) => (m.id === matchId ? updated : m)));
      toast.success("Match Verified", "Both parties have been notified to initiate secure handover.");
      return updated;
    } catch (err) {
      toast.error("Verification Error", err.message);
      throw err;
    }
  };

  const confirmMatch = async (matchId) => {
    try {
      const updated = await matchService.confirmMatch(matchId);
      setMatches((prev) => prev.map((m) => (m.id === matchId ? updated : m)));
      toast.success("Handover Complete!", "Item has been successfully recovered.");
      return updated;
    } catch (err) {
      toast.error("Confirmation Error", err.message);
      throw err;
    }
  };

  const dismissMatch = async (matchId) => {
    try {
      await matchService.dismissMatch(matchId);
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      toast.info("Match Dismissed", "Match was removed from your queue.");
    } catch (err) {
      toast.error("Error", err.message);
    }
  };

  const lostItems = items.filter((i) => i.type === "lost");
  const foundItems = items.filter((i) => i.type === "found");
  const myItems = currentUser ? items.filter((i) => i.userId === currentUser.id) : [];
  const myMatches = currentUser
    ? matches.filter(
        (m) => m.lostItem?.userId === currentUser.id || m.foundItem?.userId === currentUser.id
      )
    : matches;

  return (
    <ItemContext.Provider
      value={{
        items,
        lostItems,
        foundItems,
        myItems,
        matches,
        myMatches,
        loading,
        stats,
        filters,
        setFilters,
        reportItem,
        resolveItem,
        deleteItem,
        verifyMatch,
        confirmMatch,
        dismissMatch,
        refreshItems: loadData
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemProvider");
  }
  return context;
};

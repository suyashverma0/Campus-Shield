/**
 * Campus Shield helper utilities
 */

export const campusLocations = [
  "Central Library - 2nd Floor Reading Hall",
  "Engineering Complex - Block B",
  "Student Recreation & Sports Center",
  "Campus Dining Hall & Canteen",
  "Science Laboratory 4 (Physics Wing)",
  "Auditorium & Arts Pavilion",
  "North Campus Quad & Lawn",
  "University Health Center",
  "Hostel Cluster 3 Courtyard",
  "Main Administration Block & Registrar",
  "Parking Lot B (Bicycle & Scooter bay)",
  "Innovation & Computing Center"
];

export const itemCategories = [
  "Electronics & Gadgets",
  "Student IDs & Wallets",
  "Keys & Access Cards",
  "Backpacks & Bags",
  "Books & Study Materials",
  "Watches & Accessories",
  "Audio & Headphones",
  "Eyewear & Glasses",
  "Water Bottles & Flasks",
  "Clothing & Jackets",
  "Sports Equipment",
  "Other Valuables"
];

export const campusBuildings = [
  "Library",
  "Engineering Block",
  "Science Labs",
  "Student Center",
  "Sports Complex",
  "Hostels",
  "Cafeteria",
  "Admin Block"
];

export function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function timeAgo(dateStr) {
  if (!dateStr) return "Just now";
  const now = new Date();
  const past = new Date(dateStr);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateStr);
}

export function truncateText(text, length = 80) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function generateId(prefix = "CS") {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * Intelligent Match Scorer for comparing lost and found reports
 */
export function calculateMatchScore(lostItem, foundItem) {
  let score = 0;
  const factors = [];

  // 1. Category match (35%)
  if (lostItem.category && foundItem.category && lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
    score += 35;
    factors.push({ label: "Identical Category", points: 35, matched: true });
  } else {
    factors.push({ label: "Category Mismatch", points: 0, matched: false });
  }

  // 2. Location proximity (25%)
  if (lostItem.location && foundItem.location) {
    const loc1 = lostItem.location.toLowerCase();
    const loc2 = foundItem.location.toLowerCase();
    if (loc1 === loc2) {
      score += 25;
      factors.push({ label: "Same Specific Location", points: 25, matched: true });
    } else {
      const matchWord = campusBuildings.find(b => loc1.includes(b.toLowerCase()) && loc2.includes(b.toLowerCase()));
      if (matchWord) {
        score += 18;
        factors.push({ label: `Same Building (${matchWord})`, points: 18, matched: true });
      } else {
        factors.push({ label: "Different Campus Area", points: 5, matched: false });
        score += 5;
      }
    }
  }

  // 3. Date proximity (20%)
  if (lostItem.date && foundItem.date) {
    const d1 = new Date(lostItem.date);
    const d2 = new Date(foundItem.date);
    const daysDiff = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 1) {
      score += 20;
      factors.push({ label: "Within 24 Hours", points: 20, matched: true });
    } else if (daysDiff <= 4) {
      score += 15;
      factors.push({ label: `Within ${Math.ceil(daysDiff)} Days`, points: 15, matched: true });
    } else if (daysDiff <= 10) {
      score += 8;
      factors.push({ label: "Within 10 Days", points: 8, matched: true });
    }
  }

  // 4. Keyword / Brand / Color similarity in title or description (20%)
  const text1 = `${lostItem.title} ${lostItem.description || ""} ${lostItem.brand || ""} ${lostItem.color || ""}`.toLowerCase();
  const text2 = `${foundItem.title} ${foundItem.description || ""} ${foundItem.brand || ""} ${foundItem.color || ""}`.toLowerCase();

  const words = text1.split(/\s+/).filter(w => w.length > 3);
  let matchedWordsCount = 0;
  for (const word of words) {
    if (text2.includes(word)) {
      matchedWordsCount++;
    }
  }

  const keywordScore = Math.min(20, matchedWordsCount * 7);
  score += keywordScore;
  if (keywordScore > 0) {
    factors.push({ label: `Matching Keywords & Color (${matchedWordsCount})`, points: keywordScore, matched: true });
  }

  return {
    score: Math.min(99, Math.max(15, score)),
    factors
  };
}

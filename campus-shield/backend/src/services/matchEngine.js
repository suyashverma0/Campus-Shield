import { Item } from '../models/Item.js';
import { Match } from '../models/Match.js';
import { aiClient } from './aiClient.js';
import { env } from '../config/env.js';

const campusBuildings = [
  'Library',
  'Engineering Block',
  'Science Labs',
  'Student Center',
  'Sports Complex',
  'Hostels',
  'Cafeteria',
  'Admin Block',
];

/**
 * Compute multi-factor heuristic score between lost and found items
 */
export function calculateMetadataFactors(lostItem, foundItem) {
  let score = 0;
  const factors = [];

  // 1. Category match (30%)
  if (
    lostItem.category &&
    foundItem.category &&
    lostItem.category.toLowerCase() === foundItem.category.toLowerCase()
  ) {
    score += 30;
    factors.push({ label: 'Identical Category', score: '+30%' });
  }

  // 2. Location proximity (20%)
  if (lostItem.location && foundItem.location) {
    const loc1 = lostItem.location.toLowerCase();
    const loc2 = foundItem.location.toLowerCase();
    if (loc1 === loc2) {
      score += 20;
      factors.push({ label: 'Same Specific Location', score: '+20%' });
    } else {
      const matchWord = campusBuildings.find(
        (b) => loc1.includes(b.toLowerCase()) && loc2.includes(b.toLowerCase())
      );
      if (matchWord) {
        score += 15;
        factors.push({ label: `Same Building (${matchWord})`, score: '+15%' });
      } else {
        score += 5;
        factors.push({ label: 'Campus Vicinity', score: '+5%' });
      }
    }
  }

  // 3. Date proximity (15%)
  if (lostItem.date && foundItem.date) {
    const d1 = new Date(lostItem.date);
    const d2 = new Date(foundItem.date);
    const daysDiff = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 1) {
      score += 15;
      factors.push({ label: 'Within 24 Hours', score: '+15%' });
    } else if (daysDiff <= 4) {
      score += 10;
      factors.push({ label: `Within ${Math.ceil(daysDiff)} Days`, score: '+10%' });
    } else if (daysDiff <= 10) {
      score += 5;
      factors.push({ label: 'Within 10 Days', score: '+5%' });
    }
  }

  // 4. Keyword / Brand / Color match (15%)
  const text1 = `${lostItem.title} ${lostItem.description || ''} ${lostItem.brand || ''} ${lostItem.color || ''}`.toLowerCase();
  const text2 = `${foundItem.title} ${foundItem.description || ''} ${foundItem.brand || ''} ${foundItem.color || ''}`.toLowerCase();

  const words = text1.split(/\s+/).filter((w) => w.length > 3);
  let matchedWordsCount = 0;
  for (const word of words) {
    if (text2.includes(word)) {
      matchedWordsCount++;
    }
  }

  const keywordScore = Math.min(15, matchedWordsCount * 5);
  score += keywordScore;
  if (keywordScore > 0) {
    factors.push({
      label: `Matching Attributes & Keywords (${matchedWordsCount})`,
      score: `+${keywordScore}%`,
    });
  }

  return { score, factors };
}

/**
 * Orchestrate AI + Metadata matching for an item against complementary active items
 */
export async function runItemMatching(targetItem) {
  try {
    const isLost = targetItem.type === 'lost';
    const complementaryType = isLost ? 'found' : 'lost';

    // Find complementary active items
    const candidates = await Item.find({
      type: complementaryType,
      status: 'active',
      _id: { $ne: targetItem._id },
    }).select('+embedding');

    if (!candidates || candidates.length === 0) {
      return [];
    }

    const aiCandidateMap = new Map();

    // If targetItem has an embedding and candidates have embeddings, run FastAPI /match
    if (targetItem.embedding && targetItem.embedding.length > 0) {
      const candidatesWithEmbedding = candidates.filter(
        (c) => c.embedding && c.embedding.length > 0
      );

      if (candidatesWithEmbedding.length > 0) {
        const aiResult = await aiClient.matchCandidates({
          queryItemId: targetItem._id.toString(),
          queryEmbedding: targetItem.embedding,
          queryModelVersion: targetItem.embeddingModelVersion || 'resnet50-imagenet-v1',
          candidates: candidatesWithEmbedding,
          topK: env.AI_TOP_K || 10,
          threshold: env.AI_SIMILARITY_THRESHOLD ?? 0.3,
        });

        if (aiResult.success && aiResult.matches) {
          for (const m of aiResult.matches) {
            aiCandidateMap.set(m.lost_item_id, m);
          }
        }
      }
    }

    const createdMatches = [];

    for (const cand of candidates) {
      const lostItemDoc = isLost ? targetItem : cand;
      const foundItemDoc = isLost ? cand : targetItem;

      const candIdStr = cand._id.toString();
      const aiMatchInfo = aiCandidateMap.get(candIdStr);

      const metadata = calculateMetadataFactors(lostItemDoc, foundItemDoc);
      let totalScore = metadata.score;
      const combinedFactors = [...metadata.factors];

      let rawSim = 0;
      if (aiMatchInfo) {
        rawSim = aiMatchInfo.similarity_score;
        // Scale cosine similarity (-1 to 1, or 0.3 to 1.0) to 0-35 points
        const aiPoints = Math.round(Math.max(0, rawSim) * 35);
        totalScore += aiPoints;
        combinedFactors.unshift({
          label: `AI Visual Match (${Math.round(rawSim * 100)}% visual similarity)`,
          score: `+${aiPoints}%`,
        });
      }

      // Minimum threshold to qualify as a suggested match
      if (totalScore >= 50 || (rawSim >= 0.65)) {
        const finalScore = Math.min(99, Math.max(30, totalScore));
        const customId = `MATCH-${Math.floor(100000 + Math.random() * 900000)}`;

        const updatedMatch = await Match.findOneAndUpdate(
          {
            lostItemId: lostItemDoc._id,
            foundItemId: foundItemDoc._id,
          },
          {
            $setOnInsert: { customId },
            $set: {
              score: finalScore,
              rawSimilarity: rawSim,
              factors: combinedFactors,
              status: 'suggested',
              modelVersion: targetItem.embeddingModelVersion || 'resnet50-imagenet-v1',
              matchDate: new Date(),
            },
          },
          {
            upsert: true,
            new: true,
          }
        )
          .populate('lostItemId')
          .populate('foundItemId');

        createdMatches.push(formatMatchResponse(updatedMatch));
      }
    }

    return createdMatches;
  } catch (err) {
    console.error('[MatchEngine] Error running matching:', err.message);
    return [];
  }
}

/**
 * Format a Match document to match the frontend expectations
 */
export function formatMatchResponse(matchDoc) {
  const lost = matchDoc.lostItemId;
  const found = matchDoc.foundItemId;

  return {
    id: matchDoc.customId || matchDoc._id.toString(),
    rawId: matchDoc._id.toString(),
    score: matchDoc.score,
    rawSimilarity: matchDoc.rawSimilarity,
    status: matchDoc.status,
    verified: matchDoc.verified,
    mutualApproved: matchDoc.mutualApproved,
    matchDate: matchDoc.matchDate,
    factors: matchDoc.factors || [],
    lostItem: lost
      ? {
          id: lost.customId || lost._id.toString(),
          title: lost.title,
          category: lost.category,
          location: lost.location,
          date: lost.date,
          time: lost.time,
          description: lost.description,
          image: lost.image,
          reward: lost.reward,
          securityQuestion: lost.securityQuestion,
          status: lost.status,
          userId: lost.userId?.toString(),
          userName: lost.userName,
          userDepartment: lost.userDepartment,
        }
      : null,
    foundItem: found
      ? {
          id: found.customId || found._id.toString(),
          title: found.title,
          category: found.category,
          location: found.location,
          date: found.date,
          time: found.time,
          description: found.description,
          image: found.image,
          custodyLocation: found.custodyLocation,
          status: found.status,
          userId: found.userId?.toString(),
          userName: found.userName,
          userDepartment: found.userDepartment,
        }
      : null,
  };
}


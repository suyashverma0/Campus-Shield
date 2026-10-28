import { Match } from '../models/Match.js';
import { Item } from '../models/Item.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { formatMatchResponse } from '../services/matchEngine.js';

export const getMatches = asyncHandler(async (req, res) => {
  const { status, userId } = req.query;
  const filter = {};

  if (status && status !== 'all') {
    filter.status = status;
  }

  let matches = await Match.find(filter)
    .populate('lostItemId')
    .populate('foundItemId')
    .sort({ score: -1, createdAt: -1 });

  // Filter out any orphaned matches where an item was deleted
  matches = matches.filter((m) => m.lostItemId && m.foundItemId);

  // If userId is provided, filter by items owned by that user
  if (userId) {
    matches = matches.filter(
      (m) =>
        m.lostItemId.userId?.toString() === userId ||
        m.foundItemId.userId?.toString() === userId
    );
  }

  const formatted = matches.map(formatMatchResponse);
  return sendSuccess(res, formatted, 'Matches retrieved successfully');
});

export const getMatchById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let match = await Match.findOne({
    $or: [
      { customId: id },
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
    ],
  })
    .populate('lostItemId')
    .populate('foundItemId');

  if (!match || !match.lostItemId || !match.foundItemId) {
    throw ApiError.notFound('Match not found');
  }

  return sendSuccess(res, formatMatchResponse(match), 'Match retrieved successfully');
});

export const verifyMatch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let match = await Match.findOne({
    $or: [
      { customId: id },
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
    ],
  })
    .populate('lostItemId')
    .populate('foundItemId');

  if (!match) {
    throw ApiError.notFound('Match not found');
  }

  match.verified = true;
  match.status = 'verified';
  await match.save();

  return sendSuccess(res, formatMatchResponse(match), 'Match verified successfully');
});

export const confirmMatch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let match = await Match.findOne({
    $or: [
      { customId: id },
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
    ],
  })
    .populate('lostItemId')
    .populate('foundItemId');

  if (!match) {
    throw ApiError.notFound('Match not found');
  }

  match.mutualApproved = true;
  match.status = 'reunited';
  await match.save();

  // Mark both items as resolved
  if (match.lostItemId) {
    match.lostItemId.status = 'resolved';
    match.lostItemId.resolvedAt = new Date();
    match.lostItemId.resolutionNote = 'Reunited via AI match verification';
    await match.lostItemId.save();
  }

  if (match.foundItemId) {
    match.foundItemId.status = 'resolved';
    match.foundItemId.resolvedAt = new Date();
    match.foundItemId.resolutionNote = 'Handed over to verified owner';
    await match.foundItemId.save();
  }

  return sendSuccess(res, formatMatchResponse(match), 'Match confirmed and items reunited!');
});

export const dismissMatch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const match = await Match.findOne({
    $or: [
      { customId: id },
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
    ],
  });

  if (!match) {
    throw ApiError.notFound('Match not found');
  }

  await match.deleteOne();

  return sendSuccess(res, { success: true }, 'Match dismissed successfully');
});


import path from 'path';
import { Item } from '../models/Item.js';
import { Match } from '../models/Match.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { aiClient } from '../services/aiClient.js';
import { runItemMatching } from '../services/matchEngine.js';

export const createItem = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    category,
    location,
    specificLocation,
    date,
    time,
    description,
    brand,
    color,
    reward,
    custodyLocation,
    securityQuestion,
  } = req.body;

  if (!type || !title || !category || !location || !date || !description) {
    throw ApiError.badRequest('Missing required item fields: type, title, category, location, date, description');
  }

  // Handle image upload from file or fallback to string in body
  let imageUrl = req.body.image || '';
  let imageDiskPath = null;

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
    imageDiskPath = req.file.path;
  }

  const prefix = type === 'lost' ? 'LOST' : 'FND';
  const customId = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Extract ResNet50 features if image exists
  let embedding = undefined;
  let embeddingModelVersion = undefined;
  let aiStatus = 'not_applicable';
  let aiError = undefined;

  if (imageDiskPath) {
    const aiExtractResult = await aiClient.extractFeatures(imageDiskPath, req.file.originalname);
    if (aiExtractResult.success && aiExtractResult.embedding) {
      embedding = aiExtractResult.embedding;
      embeddingModelVersion = aiExtractResult.modelVersion;
      aiStatus = 'completed';
    } else {
      aiStatus = 'failed';
      aiError = aiExtractResult.error || 'AI feature extraction failed';
    }
  }

  const item = await Item.create({
    customId,
    type,
    title,
    category,
    location,
    specificLocation,
    date,
    time: time || '14:00',
    description,
    brand,
    color,
    image: imageUrl,
    reward: type === 'lost' ? reward : undefined,
    custodyLocation: type === 'found' ? custodyLocation : undefined,
    securityQuestion,
    status: 'active',
    userId: req.user._id,
    userName: req.user.name,
    userAvatar: req.user.avatar,
    userDepartment: req.user.department,
    userEmail: req.user.email,
    userPhone: req.user.phone,
    embedding,
    embeddingModelVersion,
    aiStatus,
    aiError,
  });

  // Run matching against complementary items
  const matches = await runItemMatching(item);

  return sendSuccess(
    res,
    {
      item: item.toJSON(),
      matches,
    },
    'Item reported successfully',
    201
  );
});

export const getItems = asyncHandler(async (req, res) => {
  const { type, category, location, status, search, userId } = req.query;
  const filter = {};

  if (type && type !== 'all') {
    filter.type = type;
  }

  if (category && category !== 'all') {
    filter.category = category;
  }

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (location && location !== 'all') {
    filter.location = { $regex: location, $options: 'i' };
  }

  if (userId) {
    filter.userId = userId;
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { title: regex },
      { description: regex },
      { location: regex },
      { brand: regex },
      { color: regex },
      { category: regex },
    ];
  }

  const items = await Item.find(filter).sort({ createdAt: -1 });

  return sendSuccess(res, items.map((i) => i.toJSON()), 'Items retrieved successfully');
});

export const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let item = null;
  if (id.includes('-')) {
    item = await Item.findOne({ customId: id });
  } else {
    try {
      item = await Item.findById(id);
    } catch {
      item = await Item.findOne({ customId: id });
    }
  }

  if (!item) {
    throw ApiError.notFound(`Item with ID ${id} not found`);
  }

  return sendSuccess(res, item.toJSON(), 'Item retrieved successfully');
});

export const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let item = await Item.findOne({ $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
  if (!item) {
    throw ApiError.notFound('Item not found');
  }

  // Authorization check
  if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    throw ApiError.forbidden('You are not authorized to update this item report');
  }

  const allowedUpdates = [
    'title',
    'category',
    'location',
    'specificLocation',
    'date',
    'time',
    'description',
    'brand',
    'color',
    'reward',
    'custodyLocation',
    'securityQuestion',
    'image',
  ];

  for (const field of allowedUpdates) {
    if (req.body[field] !== undefined) {
      item[field] = req.body[field];
    }
  }

  if (req.file) {
    item.image = `/uploads/${req.file.filename}`;
  }

  await item.save();

  return sendSuccess(res, item.toJSON(), 'Item updated successfully');
});

export const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let item = await Item.findOne({ $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
  if (!item) {
    throw ApiError.notFound('Item not found');
  }

  if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    throw ApiError.forbidden('You are not authorized to delete this item report');
  }

  await Match.deleteMany({
    $or: [{ lostItemId: item._id }, { foundItemId: item._id }],
  });

  await item.deleteOne();

  return sendSuccess(res, { success: true }, 'Item deleted successfully');
});

export const resolveItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { resolutionNote } = req.body;

  let item = await Item.findOne({ $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });
  if (!item) {
    throw ApiError.notFound('Item not found');
  }

  if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    throw ApiError.forbidden('You are not authorized to resolve this item report');
  }

  item.status = 'resolved';
  item.resolvedAt = new Date();
  item.resolutionNote = resolutionNote || 'Reunited with verified owner on campus!';
  await item.save();

  // Award karma points to user for positive resolution
  await User.findByIdAndUpdate(item.userId, { $inc: { karmaPoints: 50 } });

  // Update associated matches
  await Match.updateMany(
    {
      $or: [{ lostItemId: item._id }, { foundItemId: item._id }],
    },
    { status: 'reunited', mutualApproved: true }
  );

  return sendSuccess(res, item.toJSON(), 'Item marked as reunited successfully');
});


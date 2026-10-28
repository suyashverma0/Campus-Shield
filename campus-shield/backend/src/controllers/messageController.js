import { MessageThread } from '../models/Message.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

export const getThreads = asyncHandler(async (req, res) => {
  const currentUserId = req.user ? req.user._id.toString() : 'guest';

  // Return threads matching user or all accessible threads
  const threads = await MessageThread.find({
    $or: [
      { participants: req.user?._id },
      { participantId: currentUserId },
      { 'messages.senderId': currentUserId },
    ],
  }).sort({ lastActivity: -1 });

  return sendSuccess(res, threads.map((t) => t.toJSON()), 'Threads retrieved successfully');
});

export const getThreadById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const thread = await MessageThread.findOne({
    $or: [
      { customId: id },
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
    ],
  });

  if (!thread) {
    throw ApiError.notFound('Message thread not found');
  }

  return sendSuccess(res, thread.toJSON(), 'Thread retrieved successfully');
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    throw ApiError.badRequest('Message text cannot be empty');
  }

  const thread = await MessageThread.findOne({
    $or: [
      { customId: threadId },
      { _id: threadId.match(/^[0-9a-fA-F]{24}$/) ? threadId : null },
    ],
  });

  if (!thread) {
    throw ApiError.notFound('Message thread not found');
  }

  const newMsg = {
    senderId: req.user ? req.user._id.toString() : 'guest',
    text: text.trim(),
    timestamp: new Date(),
  };

  thread.messages.push(newMsg);
  thread.lastActivity = new Date();
  await thread.save();

  const savedMsg = thread.messages[thread.messages.length - 1];
  return sendSuccess(res, savedMsg.toJSON(), 'Message sent successfully', 201);
});

export const createOrGetThread = asyncHandler(async (req, res) => {
  const { participant, item } = req.body;

  if (!participant || !item) {
    throw ApiError.badRequest('Participant and item details are required');
  }

  const participantId = participant.id || participant._id;
  const itemId = item.id || item._id;

  let thread = await MessageThread.findOne({
    participantId: String(participantId),
    relatedItemId: String(itemId),
  });

  if (thread) {
    return sendSuccess(res, thread.toJSON(), 'Existing thread retrieved');
  }

  const customId = `thread-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentUserId = req.user ? req.user._id.toString() : 'usr-01';

  thread = await MessageThread.create({
    customId,
    participants: req.user ? [req.user._id] : [],
    participantId: String(participantId),
    participantName: participant.name || 'Campus Student',
    participantAvatar: participant.avatar || '',
    participantRole: participant.department || participant.role || 'Student',
    relatedItemId: String(itemId),
    relatedItemTitle: item.title || 'Item',
    unreadCount: 0,
    lastActivity: new Date(),
    messages: [
      {
        senderId: currentUserId,
        text: `Hi ${participant.name || 'there'}! Inquiring regarding "${item.title}" reported on Campus Shield.`,
        timestamp: new Date(),
      },
    ],
  });

  return sendSuccess(res, thread.toJSON(), 'Thread created successfully', 201);
});

export const markThreadRead = asyncHandler(async (req, res) => {
  const { threadId } = req.params;

  const thread = await MessageThread.findOne({
    $or: [
      { customId: threadId },
      { _id: threadId.match(/^[0-9a-fA-F]{24}$/) ? threadId : null },
    ],
  });

  if (thread) {
    thread.unreadCount = 0;
    await thread.save();
  }

  return sendSuccess(res, { success: true }, 'Thread marked as read');
});


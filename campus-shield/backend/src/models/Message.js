import mongoose from 'mongoose';

const singleMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

const threadSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      index: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    participantId: {
      type: String,
      required: true,
    },
    participantName: {
      type: String,
      required: true,
    },
    participantAvatar: {
      type: String,
    },
    participantRole: {
      type: String,
      default: 'Student',
    },
    relatedItemId: {
      type: String,
      required: true,
    },
    relatedItemTitle: {
      type: String,
      required: true,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    messages: [singleMessageSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.customId || ret._id.toString();
        ret.rawId = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const MessageThread = mongoose.model('MessageThread', threadSchema);


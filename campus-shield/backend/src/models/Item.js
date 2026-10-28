import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: [true, 'Item type must be either "lost" or "found"'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      index: true,
    },
    specificLocation: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      default: '12:00',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    reward: {
      type: String,
      trim: true,
    },
    custodyLocation: {
      type: String,
      trim: true,
    },
    securityQuestion: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
      index: true,
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNote: {
      type: String,
      trim: true,
    },
    // User reporting this item
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      default: 'Campus Scholar',
    },
    userAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
    userDepartment: {
      type: String,
      default: 'General',
    },
    userEmail: {
      type: String,
    },
    userPhone: {
      type: String,
    },
    // AI Feature Extraction Fields
    embedding: {
      type: [Number],
      default: undefined,
      select: false, // Don't return 2048 numbers by default on listing queries to keep payload lightweight
    },
    embeddingModelVersion: {
      type: String,
    },
    aiStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'not_applicable'],
      default: 'pending',
    },
    aiError: {
      type: String,
    },
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

// Index for search queries
itemSchema.index({ title: 'text', description: 'text', brand: 'text', color: 'text' });

export const Item = mongoose.model('Item', itemSchema);


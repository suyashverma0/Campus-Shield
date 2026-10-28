import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      index: true,
    },
    lostItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true,
    },
    foundItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    rawSimilarity: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['suggested', 'verified', 'reunited'],
      default: 'suggested',
      index: true,
    },
    factors: [
      {
        label: { type: String, required: true },
        score: { type: String, required: true },
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    mutualApproved: {
      type: Boolean,
      default: false,
    },
    modelVersion: {
      type: String,
    },
    matchDate: {
      type: Date,
      default: Date.now,
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

// Prevent duplicate matches between the exact same lost and found items
matchSchema.index({ lostItemId: 1, foundItemId: 1 }, { unique: true });

export const Match = mongoose.model('Match', matchSchema);


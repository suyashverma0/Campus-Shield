import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { env } from '../config/env.js';

const AI_BASE_URL = env.AI_SERVICE_URL.replace(/\/+$/, '');
const DEFAULT_TIMEOUT_MS = 15000;

export const aiClient = {
  /**
   * Check AI service status and model readiness
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${AI_BASE_URL}/health`, {
        timeout: 3000,
      });
      return {
        isAvailable: true,
        data: response.data,
      };
    } catch (error) {
      return {
        isAvailable: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Extract 2048-d ResNet50 embedding from an image file path or buffer
   */
  async extractFeatures(filePathOrBuffer, originalName = 'image.jpg') {
    try {
      const form = new FormData();

      if (typeof filePathOrBuffer === 'string') {
        if (!fs.existsSync(filePathOrBuffer)) {
          throw new Error(`Image file not found on disk: ${filePathOrBuffer}`);
        }
        form.append('image', fs.createReadStream(filePathOrBuffer), originalName);
      } else if (Buffer.isBuffer(filePathOrBuffer)) {
        form.append('image', filePathOrBuffer, { filename: originalName });
      } else {
        throw new Error('Unsupported image input for feature extraction');
      }

      const response = await axios.post(`${AI_BASE_URL}/extract-features`, form, {
        headers: form.getHeaders(),
        timeout: DEFAULT_TIMEOUT_MS,
        maxContentLength: 50 * 1024 * 1024,
      });

      return {
        success: true,
        embedding: response.data.embedding,
        dimension: response.data.dimension,
        modelVersion: response.data.model_version,
      };
    } catch (error) {
      const detail = error.response?.data?.detail || error.message;
      console.warn(`[AI Client] /extract-features failed: ${detail}`);
      return {
        success: false,
        error: detail,
      };
    }
  },

  /**
   * Query FastAPI /match endpoint with genuine embeddings
   */
  async matchCandidates({
    queryItemId,
    queryEmbedding,
    queryModelVersion,
    candidates,
    topK = env.AI_TOP_K || 10,
    threshold = env.AI_SIMILARITY_THRESHOLD ?? 0.5,
  }) {
    try {
      if (!candidates || candidates.length === 0) {
        return {
          success: true,
          matches: [],
          skipped: [],
          candidatesConsidered: 0,
        };
      }

      const payload = {
        query_item_id: String(queryItemId),
        query_embedding: queryEmbedding,
        query_model_version: queryModelVersion,
        candidates: candidates.map((cand) => ({
          lost_item_id: String(cand.id || cand._id),
          embedding: cand.embedding,
          model_version: cand.embeddingModelVersion || queryModelVersion,
        })),
        top_k: topK,
        threshold: threshold,
      };

      const response = await axios.post(`${AI_BASE_URL}/match`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: DEFAULT_TIMEOUT_MS,
      });

      return {
        success: true,
        matches: response.data.matches || [],
        skipped: response.data.skipped || [],
        candidatesConsidered: response.data.candidates_considered || 0,
        thresholdApplied: response.data.threshold_applied,
      };
    } catch (error) {
      const detail = error.response?.data?.detail || error.message;
      console.warn(`[AI Client] /match failed: ${detail}`);
      return {
        success: false,
        matches: [],
        error: detail,
      };
    }
  },
};


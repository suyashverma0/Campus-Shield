import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { aiClient } from './services/aiClient.js';

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    console.log('--------------------------------------------------');
    console.log('🛡️  Starting Campus Shield Express Backend Server...');
    console.log(`📡 Environment: ${env.NODE_ENV}`);
    console.log(`🌐 Configured Port: ${PORT}`);
    console.log(`🤖 AI Service URL: ${env.AI_SERVICE_URL}`);
    console.log('--------------------------------------------------');

    await connectDB();

    const server = app.listen(PORT, async () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
      console.log(`📂 Upload directory served at http://localhost:${PORT}/uploads/`);

      // Verify AI service connectivity asynchronously
      const aiStatus = await aiClient.checkHealth();
      if (aiStatus.isAvailable) {
        console.log(`✅ FastAPI AI Service is reachable: ${JSON.stringify(aiStatus.data)}`);
      } else {
        console.warn(`⚠️  FastAPI AI Service is currently unreachable at ${env.AI_SERVICE_URL} (${aiStatus.error}). Item reports will still function with metadata fallback matching until AI service comes online.`);
      }
    });

    const shutdown = async (signal) => {
      console.log(`\n[${signal}] Received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();


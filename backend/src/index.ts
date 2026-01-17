import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import tasksRouter from './routes/tasks';
import boardsRouter from './routes/boards';
import { AppDataSource } from './config/data-source';
import authRouter from "./routes/auth";
import columnsRouter from './routes/columns';


dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

/* ============================================================================
 * Middleware
 * ============================================================================
 */
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ============================================================================
 * Routes
 * ============================================================================
 */
app.get('/api/health', async (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
  });
});

app.use('/api/tasks', tasksRouter);
app.use('/api/boards', boardsRouter);
app.use("/api/auth", authRouter);
app.use('/api/columns', columnsRouter);

/* ============================================================================
 * Error handling 
 * ============================================================================
 */
app.use(errorHandler);

/* ============================================================================
 * Server & Database bootstrap
 * ============================================================================
 */
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
  } catch (err) {
    /**
     * ✅ FIX CRITIQUE CI / TESTS
     * En tests (Vitest / CI), on NE DOIT JAMAIS :
     * - tenter une vraie connexion DB
     * - ni appeler process.exit()
     */
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.START_SERVER === 'false'
    ) {
      console.warn(
        '⚠️ Database not initialized (test mode / START_SERVER=false). Continuing without DB.'
      );
      return;
    }

    console.error('❌ Database connection failed', err);
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

/**
 * ============================================================================
 * (CI / VITEST)
 * ============================================================================
 * - En test : on exporte seulement l'app (Supertest)
 * - En dev/prod : on démarre DB + serveur
 */
const shouldStartServer =
  process.env.START_SERVER !== 'false' &&
  process.env.NODE_ENV !== 'test';

if (shouldStartServer) {
  startServer();
}

export default app;


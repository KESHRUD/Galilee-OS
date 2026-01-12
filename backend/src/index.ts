import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import tasksRouter from './routes/tasks';
import boardsRouter from './routes/boards';
import { AppDataSource } from './config/data-source';

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get('/api/health', async (_, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
  });
});


app.use('/api/tasks', tasksRouter);
app.use('/api/boards', boardsRouter);

// Error handling (must be last)
app.use(errorHandler);

//Démarrage du serveur après initialisation DB
//On init TypeORM au démarrage
//Si la DB est KO : on log + exit (pour éviter un backend "à moitié vivant")
async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection failed', err);
    process.exit(1);
  }

  if (process.env.START_SERVER !== 'false') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}
//lancement centralise
startServer();

export default app;

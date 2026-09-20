import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db.js';
import { authRouter } from './routes/auth.js';
import { nodesRouter } from './routes/nodes.js';
import { alertsRouter } from './routes/alerts.js';
import { actionsRouter } from './routes/actions.js';
import { metricsRouter } from './routes/metrics.js';
import { settingsRouter } from './routes/settings.js';
import { simulationRouter } from './routes/simulation.js';
import { ingestRouter } from './routes/ingest.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite schema and seed data
initDatabase();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'VanRakshak Server',
    prototypeMode: true,
    storage: 'SQLite (better-sqlite3)',
    timestamp: new Date().toISOString(),
    wpcRegion: 'IN865 (865-867 MHz)',
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/nodes', nodesRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/actions', actionsRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/simulation', simulationRouter);
app.use('/api/ingest', ingestRouter);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌲 VanRakshak Backend running on port ${PORT}`);
    console.log(`📡 Ingestion endpoint: http://localhost:${PORT}/api/ingest/alert`);
    console.log(`🛡️ Prototype Demo Mode Active — Using Simulated Sensor Data`);
  });
}

export default app;

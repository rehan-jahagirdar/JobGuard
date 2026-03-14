import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './src/routes/analyzeRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { rateLimitMiddleware } from './src/middleware/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://job-guard-flame.vercel.app',
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limit analyze endpoint
app.use('/api/analyze', rateLimitMiddleware);

// Routes
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`JobGuard server running on port ${PORT}`);
  console.log(`Allowed origins: localhost:5173, job-guard-flame.vercel.app`);
});
// server/src/middleware/rateLimiter.js
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({
  points: 10,    // 10 requests
  duration: 60,  // per 60 seconds per IP
});

export async function rateLimitMiddleware(req, res, next) {
  try {
    await limiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ 
      error: 'Too many requests. Please wait a minute before trying again.' 
    });
  }
}
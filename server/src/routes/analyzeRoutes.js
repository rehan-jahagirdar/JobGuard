import { Router } from 'express';
import { analyzePosting, getHistory, getByShareId } from '../controllers/analyzeController.js';

const router = Router();

router.post('/', analyzePosting);           // Main analysis endpoint
router.get('/history/:userId', getHistory); // User's check history
router.get('/share/:shareId', getByShareId); // Public share link

export default router;
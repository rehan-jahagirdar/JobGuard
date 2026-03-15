import express from 'express';
import { analyzePosting, getHistory, deleteAnalysis } from '../controllers/analyzeController.js';

const router = express.Router();

router.post('/', analyzePosting);
router.get('/history/:userId', getHistory);
router.delete('/history/:id', deleteAnalysis); // 👈 New Delete Route

export default router;
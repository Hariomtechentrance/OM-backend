import express from 'express';
import { trackActivity, getAnalyticsDashboard, getUserJourney } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - track user activity (no auth required)
router.post('/track', trackActivity);

// Admin routes - view analytics (protected routes)
router.get('/dashboard', protect, getAnalyticsDashboard);
router.get('/journey/:sessionId', protect, getUserJourney);

export default router;

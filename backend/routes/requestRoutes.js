// filepath: backend/routes/requestRoutes.js
import express from 'express';
import { getRequests, handleRequest } from '../controllers/requestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getRequests).post(protect, admin, handleRequest);

export default router;
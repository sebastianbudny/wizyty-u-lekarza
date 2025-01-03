// filepath: backend/routes/emailRoutes.js
import express from 'express';
import { getEmails, createEmail } from '../controllers/emailController.js';

const router = express.Router();

router.route('/').get(getEmails).post(createEmail);

export default router;
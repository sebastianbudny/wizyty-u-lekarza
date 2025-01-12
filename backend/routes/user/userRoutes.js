import express from 'express';
import dotenv from 'dotenv';
import loginRegisterForgotAndChangePassword from './loginRegisterForgotAndChangePassword.js';
import admin from './admin.js';
import requestForAdmin from './requestForAdmin.js';
import superAdmin from './superAdmin.js';

dotenv.config();

const router = express.Router();

router.use('/', loginRegisterForgotAndChangePassword);
router.use('/', admin);
router.use('/', requestForAdmin);
router.use('/', superAdmin);

export default router;
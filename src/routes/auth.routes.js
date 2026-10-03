import express from 'express';
import authController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/signUp', authController.signUp.bind(authController));
router.post('/signIn', authController.signIn.bind(authController));

export default router;

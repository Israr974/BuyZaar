import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-order', auth, createRazorpayOrder);
paymentRouter.post('/verify', auth, verifyPayment);

export default paymentRouter;

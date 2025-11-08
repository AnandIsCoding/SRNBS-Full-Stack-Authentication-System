import express from 'express'

import { forgotPassword, getMyProfile, login, logout, registerWithGoogleController,resetPassword, signupUser, verifyEmailOTP } from '../controllers/auth.controller.js';
import {  isAuthenticated } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signupUser)
authRouter.post('/verify-otp', verifyEmailOTP)
 authRouter.post('/login', login)

 authRouter.get("/profile", isAuthenticated, getMyProfile);
 authRouter.post("/google", registerWithGoogleController);


authRouter.post('/forgot-password', forgotPassword)
authRouter.put("/reset-password/:token", resetPassword)

 authRouter.delete('/logout',isAuthenticated, logout)
export default authRouter;
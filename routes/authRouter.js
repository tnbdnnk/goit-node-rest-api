import express from "express";
import {
    register,
    login,
    logout,
    getCurrentUser,
    updateSubscription,
    uploadAvatar,
    getAvatar,
    verifyEmail,
    resendVerificationEmail
} from "../controllers/authControllers.js";
import authMiddleware from '../middleware/authMiddleware.js';
import { validateRegisterBody } from "../middleware/validateRegisterBody.js";
import { validateLoginBody } from "../middleware/validateLoginBody.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import { verifyEmailValidation } from "../middleware/validateEmailValidationBody.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegisterBody, register);
authRouter.post("/login", validateLoginBody, login);

authRouter.use(authMiddleware);

authRouter.get('/verify/:verificationToken', verifyEmail);
authRouter.post('/verify', verifyEmailValidation,resendVerificationEmail);
authRouter.post("/logout", logout);
authRouter.get("/current", getCurrentUser);
authRouter.patch("/", updateSubscription);
authRouter.get("/avatars", getAvatar);
authRouter.patch("/avatars", uploadMiddleware.single('avatar'), uploadAvatar);

export default authRouter;

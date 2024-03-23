import express from "express";
import {
    register,
    login,
    logout,
    getCurrentUser,
    updateSubsctiption,
    uploadAvatar,
    getAvatar
} from "../controllers/authControllers.js";
import authMiddleware from '../middleware/authMiddleware.js';
import { validateRegisterBody } from "../middleware/validateRegisterBody.js";
import { validateLoginBody } from "../middleware/validateLoginBody.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegisterBody, register);
authRouter.post("/login", validateLoginBody, login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, getCurrentUser);
authRouter.patch("/", authMiddleware, updateSubsctiption);
authRouter.get("/avatars", authMiddleware, getAvatar);
authRouter.patch("/avatars", authMiddleware, uploadMiddleware.single('avatar'), uploadAvatar);

export default authRouter;

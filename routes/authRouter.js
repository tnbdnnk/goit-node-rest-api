import express from "express";
import {
    register,
    login,
    logout,
    getCurrentUser,
    updateSubsctiption
} from "../controllers/authControllers.js";
import authMiddleware from '../middleware/authMiddleware.js';
import { validateRegisterBody } from "../middleware/validateRegisterBody.js";
import { validateLoginBody } from "../middleware/validateLoginBody.js";

const authRouter = express.Router();

authRouter.post("/register", validateRegisterBody, register);
authRouter.post("/login", validateLoginBody, login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, getCurrentUser);
authRouter.patch("/", authMiddleware, updateSubsctiption);

export default authRouter;

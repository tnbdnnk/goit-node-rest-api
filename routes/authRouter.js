import express from "express";
import { register, login, logout, getCurrentUser } from "../controllers/authControllers.js";
import authMiddleware from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authMiddleware, logout);
authRouter.get("/current", authMiddleware, getCurrentUser);

export default authRouter;

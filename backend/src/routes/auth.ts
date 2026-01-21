import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middleware/AuthContext";

const router = Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", AuthController.login);

/**
 * POST /api/auth/register
 * Body: { email, password }
 */
router.post("/register", AuthController.register);

/**
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 */
router.get("/me", authMiddleware, AuthController.me);

export default router;

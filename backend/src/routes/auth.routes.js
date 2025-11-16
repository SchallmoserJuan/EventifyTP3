import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { authGuard } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authGuard, me);

export default router;

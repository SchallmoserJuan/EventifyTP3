import { Router } from "express";
import {
  listEventos,
  getEvento,
  createEvento,
  updateEvento,
  deleteEvento,
} from "../controllers/eventoController.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authorizeRoles("admin", "manager", "viewer"), listEventos);
router.get("/:id", authorizeRoles("admin", "manager", "viewer"), getEvento);
router.post("/", authorizeRoles("admin", "manager"), createEvento);
router.put("/:id", authorizeRoles("admin", "manager"), updateEvento);
router.delete("/:id", authorizeRoles("admin"), deleteEvento);

export default router;

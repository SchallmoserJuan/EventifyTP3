import { Router } from "express";
import {
  listTareas,
  getTarea,
  getTareaFormOptions,
  createTarea,
  updateTarea,
  deleteTarea,
} from "../controllers/tareaController.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authorizeRoles("admin", "manager", "viewer"), listTareas);
router.get("/options", authorizeRoles("admin", "manager"), getTareaFormOptions);
router.get("/:id", authorizeRoles("admin", "manager", "viewer"), getTarea);
router.post("/", authorizeRoles("admin", "manager"), createTarea);
router.put("/:id", authorizeRoles("admin", "manager"), updateTarea);
router.delete("/:id", authorizeRoles("admin"), deleteTarea);

export default router;

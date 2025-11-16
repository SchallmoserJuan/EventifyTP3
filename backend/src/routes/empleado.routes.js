import { Router } from "express";
import {
  listEmpleados,
  getEmpleado,
  getEmpleadoFormOptions,
  createEmpleado,
  updateEmpleado,
  deleteEmpleado,
} from "../controllers/empleadoController.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authorizeRoles("admin", "manager", "viewer"), listEmpleados);
router.get("/options", authorizeRoles("admin", "manager"), getEmpleadoFormOptions);
router.get("/:id", authorizeRoles("admin", "manager", "viewer"), getEmpleado);
router.post("/", authorizeRoles("admin", "manager"), createEmpleado);
router.put("/:id", authorizeRoles("admin", "manager"), updateEmpleado);
router.delete("/:id", authorizeRoles("admin"), deleteEmpleado);

export default router;

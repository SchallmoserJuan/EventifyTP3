import { Router } from "express";
import {
  getAllApi,
  getByIdApi,
  createApi,
  updateApi,
  destroyApi,
} from "../controllers/tareaController.js";

const router = Router();

// GET /api/tareas -> Listar todas las tareas (con filtros)
router.get("/", getAllApi);

// GET /api/tareas/:id -> Obtener una tarea por ID
router.get("/:id", getByIdApi);

// POST /api/tareas -> Crear una nueva tarea
router.post("/", createApi);

// PUT /api/tareas/:id -> Actualizar una tarea existente
router.put("/:id", updateApi);

// DELETE /api/tareas/:id -> Eliminar (lógicamente) una tarea
router.delete("/:id", destroyApi);

export default router;

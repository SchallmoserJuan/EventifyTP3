import express from "express";
import empleadoController from "../controllers/empleadoController.js";

const router = express.Router();

// GET /empleados - Listar empleados (para la vista web)
router.get("/", empleadoController.getAll);

// GET /empleados/nuevo - Formulario para crear
router.get("/nuevo", empleadoController.create);

// POST /empleados - Crear empleado
router.post("/", empleadoController.store);

// GET /empleados/:id/editar - Formulario para editar
router.get("/:id/editar", empleadoController.edit);

// PUT /empleados/:id - Actualizar empleado
router.put("/:id", empleadoController.update);

// DELETE /empleados/:id - Eliminar empleado
router.delete("/:id", empleadoController.destroy);

export default router;

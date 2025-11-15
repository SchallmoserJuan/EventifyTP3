import express from "express";
import empleadoController from "../controllers/empleadoController.js";

const router = express.Router();

// Rutas de la API para Empleados
// Utilizan los métodos 'Api' del controlador para devolver JSON

// GET /api/empleados -> Listar todos los empleados
router.get("/", empleadoController.getAllApi);

// GET /api/empleados/:id -> Obtener un empleado por ID
router.get("/:id", empleadoController.getByIdApi);

// POST /api/empleados -> Crear un nuevo empleado
router.post("/", empleadoController.createApi);

// PUT /api/empleados/:id -> Actualizar un empleado existente
router.put("/:id", empleadoController.updateApi);

// DELETE /api/empleados/:id -> Eliminar (lógicamente) un empleado
router.delete("/:id", empleadoController.destroyApi);

export default router;

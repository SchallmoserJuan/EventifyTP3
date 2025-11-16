import Empleado from "../models/Empleado.js";
import Rol from "../models/Rol.js";
import Area from "../models/Area.js";
import Tarea from "../models/Tarea.js";

const buildValidationMessage = (error) => {
  if (error.name === "ValidationError") {
    return Object.values(error.errors)
      .map((e) => e.message)
      .join(", ");
  }
  if (error.code === 11000) {
    return "Ya existe un empleado con ese email";
  }
  return error.message;
};

const pickEmpleadoPayload = (body) => ({
  nombre: body.nombre,
  email: body.email,
  rol: body.rol,
  area: body.area,
});

const activeFilter = {
  $or: [
    { activo: { $exists: false } },
    { activo: { $nin: [false, "false", 0] } }, // cualquiera que no sea false
  ],
};

export async function listEmpleados(_req, res) {
  try {
    const empleados = await Empleado.find(activeFilter)
      .populate("rol", "nombre descripcion")
      .populate("area", "nombre color")
      .sort({ fechaIngreso: -1 });
    res.json({ data: empleados });
  } catch (error) {
    console.error("Error al listar empleados:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
}

export async function getEmpleado(req, res) {
  try {
    const empleado = await Empleado.findById(req.params.id)
      .populate("rol", "nombre descripcion")
      .populate("area", "nombre color");
    if (!empleado || empleado.activo === false) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    res.json({ data: empleado });
  } catch (error) {
    console.error("Error al obtener empleado:", error);
    res.status(500).json({ error: "Error al obtener empleado" });
  }
}

export async function getEmpleadoFormOptions(_req, res) {
  try {
    const [roles, areas] = await Promise.all([Rol.find(), Area.find()]);
    res.json({ roles, areas });
  } catch (error) {
    console.error("Error al cargar opciones de empleado:", error);
    res.status(500).json({ error: "Error al cargar opciones" });
  }
}

export async function createEmpleado(req, res) {
  try {
    const empleado = await Empleado.create(pickEmpleadoPayload(req.body));
    res.status(201).json({ data: empleado });
  } catch (error) {
    console.error("Error al crear empleado:", error);
    res.status(400).json({ error: buildValidationMessage(error) });
  }
}

export async function updateEmpleado(req, res) {
  try {
    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      pickEmpleadoPayload(req.body),
      { new: true, runValidators: true }
    )
      .populate("rol", "nombre descripcion")
      .populate("area", "nombre color");

    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    res.json({ data: empleado });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(400).json({ error: buildValidationMessage(error) });
  }
}

export async function deleteEmpleado(req, res) {
  try {
    const tareasAsignadas = await Tarea.countDocuments({
      empleado: req.params.id,
      estado: { $in: ["pendiente", "en proceso"] },
      activo: { $ne: false },
    });

    if (tareasAsignadas > 0) {
      return res.status(400).json({
        error: `No se puede eliminar: el empleado tiene ${tareasAsignadas} tareas pendientes o en proceso.`,
      });
    }

    await Empleado.softDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ error: "Error al eliminar empleado" });
  }
}

import Tarea from "../models/Tarea.js";
import Empleado from "../models/Empleado.js";
import Evento from "../models/Evento.js";

const estadosDisponibles = ["pendiente", "en proceso", "finalizada"];
const prioridadesDisponibles = ["alta", "media", "baja"];

const pickTareaPayload = (body) => ({
  titulo: body.titulo,
  descripcion: body.descripcion,
  estado: body.estado,
  prioridad: body.prioridad,
  fechaInicio: body.fechaInicio,
  fechaFin: body.fechaFin,
  empleado: body.empleado,
  evento: body.evento,
  horasEstimadas: body.horasEstimadas,
  horasReales: body.horasReales,
});

const buildQuery = ({ estado, prioridad, empleadoId, eventoId }) => {
  const query = { activo: { $nin: [false, "false", 0] } };
  if (estado) query.estado = estado;
  if (prioridad) query.prioridad = prioridad;
  if (empleadoId) query.empleado = empleadoId;
  if (eventoId) query.evento = eventoId;
  return query;
};

export async function listTareas(req, res) {
  try {
    const tareas = await Tarea.find(buildQuery(req.query))
      .populate("empleado", "nombre email")
      .populate("evento", "nombre")
      .sort({ createdAt: -1 });
    res.json({ data: tareas });
  } catch (error) {
    console.error("Error al listar tareas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
}

export async function getTarea(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id)
      .populate("empleado", "nombre email")
      .populate("evento", "nombre");
    if (!tarea || tarea.activo === false) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json({ data: tarea });
  } catch (error) {
    console.error("Error al obtener tarea:", error);
    res.status(500).json({ error: "Error al obtener tarea" });
  }
}

export async function getTareaFormOptions(_req, res) {
  try {
    const [empleados, eventos] = await Promise.all([
      Empleado.find({ activo: { $nin: [false, "false", 0] } }).select("nombre"),
      Evento.find({ activo: { $nin: [false, "false", 0] } }).select("nombre"),
    ]);
    res.json({
      empleados,
      eventos,
      estados: estadosDisponibles,
      prioridades: prioridadesDisponibles,
    });
  } catch (error) {
    console.error("Error al obtener opciones de tareas:", error);
    res.status(500).json({ error: "Error al obtener opciones" });
  }
}

export async function createTarea(req, res) {
  try {
    const tarea = await Tarea.create(pickTareaPayload(req.body));
    res.status(201).json({ data: tarea });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateTarea(req, res) {
  try {
    const tarea = await Tarea.findByIdAndUpdate(
      req.params.id,
      pickTareaPayload(req.body),
      { new: true, runValidators: true }
    )
      .populate("empleado", "nombre email")
      .populate("evento", "nombre");
    if (!tarea) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json({ data: tarea });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteTarea(req, res) {
  try {
    await Tarea.findByIdAndUpdate(req.params.id, { activo: false });
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
}

import Tarea from "../models/Tarea.js";
import Empleado from "../models/Empleado.js";
import Evento from "../models/Evento.js";
export async function index(req, res) {
  try {
    const filtros = req.query;
    const query = {};
    if (filtros.estado) query.estado = filtros.estado;
    if (filtros.prioridad) query.prioridad = filtros.prioridad;
    if (filtros.empleadoId) query.empleado = filtros.empleadoId; // Corregido: de empleadoId a empleado
    if (filtros.eventoId) query.evento = filtros.eventoId; // Corregido: de eventoId a evento
    query.activo = true;

    const tareas = await Tarea.find(query).populate("empleado evento");
    const empleados = await Empleado.find({ activo: true });
    const eventos = await Evento.find({ activo: true });

    res.render("tareas/index", {
      titulo: "Gestión de Tareas",
      tareas,
      empleados,
      eventos,
      filtros,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar tareas");
  }
}
export async function create(req, res) {
  try {
    const empleados = await Empleado.find({ activo: true });
    const eventos = await Evento.find({ activo: true });
    res.render("tareas/form", {
      titulo: "Nueva Tarea",
      tarea: null,
      empleados,
      eventos,
      estados: ["pendiente", "en proceso", "finalizada"],
      prioridades: ["alta", "media", "baja"],
    });
  } catch (error) {
    res.status(500).send("Error al cargar formulario");
  }
}

export async function store(req, res) {
  try {
    const nuevaTarea = new Tarea({
      ...req.body,
      activo: true,
    });
    await nuevaTarea.save();
    res.redirect("/tareas");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear tarea");
  }
}

export async function edit(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id).populate(
      "empleado evento"
    );
    const empleados = await Empleado.find({ activo: true });
    const eventos = await Evento.find({ activo: true });
    if (!tarea) {
      return res.status(404).send("Tarea no encontrada");
    }
    res.render("tareas/form", {
      titulo: "Editar Tarea",
      tarea,
      empleados,
      eventos,
      estados: ["pendiente", "en proceso", "finalizada"],
      prioridades: ["alta", "media", "baja"],
    });
  } catch (error) {
    res.status(500).send("Error al cargar tarea");
  }
}

export async function update(req, res) {
  try {
    await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect("/tareas");
  } catch (error) {
    res.status(500).send("Error al actualizar tarea");
  }
}

export async function destroy(req, res) {
  try {
    await Tarea.findByIdAndUpdate(req.params.id, { activo: false });
    res.redirect("/tareas");
  } catch (error) {
    res.status(500).send("Error al eliminar tarea");
  }
}

// --- MÉTODOS PARA LA API ---

// GET /api/tareas
export async function getAllApi(req, res) {
  try {
    const filtros = req.query;
    const query = {};
    if (filtros.estado) query.estado = filtros.estado;
    if (filtros.prioridad) query.prioridad = filtros.prioridad;
    if (filtros.empleado) query.empleado = filtros.empleado;
    if (filtros.evento) query.evento = filtros.evento;
    query.activo = true;

    const tareas = await Tarea.find(query)
      .populate("empleado", "nombre email")
      .populate("evento", "nombre");

    res.json(tareas);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
}

// GET /api/tareas/:id
export async function getByIdApi(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea || !tarea.activo) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json(tarea);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Error al obtener tarea" });
  }
}

// POST /api/tareas
export async function createApi(req, res) {
  try {
    const nuevaTarea = await Tarea.create(req.body);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error("API Error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error al crear tarea" });
  }
}

// PUT /api/tareas/:id
export async function updateApi(req, res) {
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!tareaActualizada) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    res.json(tareaActualizada);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
}

// DELETE /api/tareas/:id
export async function destroyApi(req, res) {
  try {
    // Usamos el mismo método de soft-delete que la ruta web
    await Tarea.findByIdAndUpdate(req.params.id, { activo: false });
    res.status(204).send();
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
}

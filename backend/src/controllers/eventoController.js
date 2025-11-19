import Evento from "../models/Evento.js";

const pickEventoPayload = (body) => ({
  nombre: body.nombre,
  descripcion: body.descripcion,
  fecha: body.fecha,
  lugar: body.lugar,
  cliente: body.cliente,
  activo: body.activo !== undefined ? body.activo : true,
});

const activeFilter = {
  $or: [{ activo: { $exists: false } }, { activo: { $nin: [false, "false", 0] } }],
};

export async function listEventos(_req, res) {
  try {
    const eventos = await Evento.find(activeFilter).sort({ fecha: -1 });
    res.json({ data: eventos });
  } catch (error) {
    console.error("Error al listar eventos:", error);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
}

export async function getEvento(req, res) {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento || evento.activo === false || evento.activo === "false") {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    res.json({ data: evento });
  } catch (error) {
    console.error("Error al obtener evento:", error);
    res.status(500).json({ error: "Error al obtener evento" });
  }
}

export async function createEvento(req, res) {
  try {
    const evento = await Evento.create(pickEventoPayload(req.body));
    res.status(201).json({ data: evento });
  } catch (error) {
    console.error("Error al crear evento:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function updateEvento(req, res) {
  try {
    const evento = await Evento.findByIdAndUpdate(
      req.params.id,
      pickEventoPayload(req.body),
      { new: true, runValidators: true }
    );
    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }
    res.json({ data: evento });
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    res.status(400).json({ error: error.message });
  }
}

export async function deleteEvento(req, res) {
  try {
    await Evento.findByIdAndUpdate(req.params.id, { activo: false });
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).json({ error: "Error al eliminar evento" });
  }
}

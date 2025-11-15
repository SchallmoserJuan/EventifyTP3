import Empleado from "../models/Empleado.js";
import Rol from "../models/Rol.js";
import Area from "../models/Area.js";

const empleadoController = {
  // Mostrar lista de empleados
  async getAll(req, res) {
    try {
      // populate() trae automáticamente los datos de rol y área
      const empleados = await Empleado.find({ activo: true })
        .populate("rol", "nombre descripcion") // Solo trae nombre y descripción del rol
        .populate("area", "nombre color")
        .sort({ fechaIngreso: -1 }); // Más nuevos primero

      // También necesitamos roles y áreas para los filtros
      const roles = await Rol.find();
      const areas = await Area.find();

      // Leer el mensaje de error de la URL (si existe)
      const error = req.query.error;

      res.render("empleados/index", {
        titulo: "Gestión de Empleados",
        empleados,
        roles,
        areas,
        error,
      });
    } catch (error) {
      console.error("Error al cargar empleados:", error);
      res.status(500).render("error", {
        mensaje: "Error al cargar empleados",
        error: process.env.NODE_ENV === "development" ? error : {},
      });
    }
  },

  // Mostrar formulario para crear empleado
  async create(req, res) {
    try {
      const roles = await Rol.find();
      const areas = await Area.find();

      res.render("empleados/form", {
        titulo: "Nuevo Empleado",
        empleado: null, // Formulario vacío
        roles,
        areas,
      });
    } catch (error) {
      console.error("Error al cargar formulario:", error);
      res.status(500).render("error", {
        mensaje: "Error al cargar formulario",
      });
    }
  },

  // Guardar nuevo empleado
  async store(req, res) {
    try {
      // Mongoose valida automáticamente según el schema
      const nuevoEmpleado = await Empleado.create({
        nombre: req.body.nombre,
        email: req.body.email,
        rol: req.body.rol, // Mongoose convierte string a ObjectId automáticamente
        area: req.body.area,
      });

      console.log(`✅ Empleado creado: ${nuevoEmpleado.nombre}`);
      res.redirect("/empleados");
    } catch (error) {
      console.error("Error creando empleado:", error);

      // Si es error de validación de Mongoose
      if (error.name === "ValidationError") {
        const roles = await Rol.find();
        const areas = await Area.find();

        return res.status(400).render("empleados/form", {
          titulo: "Nuevo Empleado",
          empleado: req.body,
          roles,
          areas,
          error:
            "Error de validación: " +
            Object.values(error.errors)
              .map((e) => e.message)
              .join(", "),
        });
      }

      // Si es error de email duplicado
      if (error.code === 11000) {
        const roles = await Rol.find();
        const areas = await Area.find();

        return res.status(400).render("empleados/form", {
          titulo: "Nuevo Empleado",
          empleado: req.body,
          roles,
          areas,
          error: "Ya existe un empleado con ese email",
        });
      }

      res.status(500).render("error", {
        mensaje: "Error al crear empleado",
      });
    }
  },

  // Mostrar formulario para editar
  async edit(req, res) {
    try {
      const empleado = await Empleado.findById(req.params.id);

      if (!empleado || !empleado.activo) {
        return res.status(404).render("error", {
          mensaje: "Empleado no encontrado",
        });
      }

      const roles = await Rol.find();
      const areas = await Area.find();

      res.render("empleados/form", {
        titulo: "Editar Empleado",
        empleado,
        roles,
        areas,
      });
    } catch (error) {
      console.error("Error al cargar empleado:", error);
      res.status(500).render("error", {
        mensaje: "Error al cargar empleado",
      });
    }
  },

  // Actualizar empleado
  async update(req, res) {
    try {
      const empleadoActualizado = await Empleado.findByIdAndUpdate(
        req.params.id,
        {
          nombre: req.body.nombre,
          email: req.body.email,
          rol: req.body.rol,
          area: req.body.area,
        },
        {
          new: true, // Retorna el documento actualizado
          runValidators: true, // Ejecuta validaciones del schema
        }
      );

      if (!empleadoActualizado) {
        return res.status(404).render("error", {
          mensaje: "Empleado no encontrado",
        });
      }

      console.log(`✅ Empleado actualizado: ${empleadoActualizado.nombre}`);
      res.redirect("/empleados");
    } catch (error) {
      console.error("Error actualizando empleado:", error);

      // Manejo de errores similar al create
      if (error.name === "ValidationError") {
        const empleado = await Empleado.findById(req.params.id);
        const roles = await Rol.find();
        const areas = await Area.find();

        return res.status(400).render("empleados/form", {
          titulo: "Editar Empleado",
          empleado: { ...empleado.toObject(), ...req.body },
          roles,
          areas,
          error:
            "Error de validación: " +
            Object.values(error.errors)
              .map((e) => e.message)
              .join(", "),
        });
      }

      res.status(500).render("error", {
        mensaje: "Error al actualizar empleado",
      });
    }
  },

  // Eliminar empleado (soft delete)
  async destroy(req, res) {
    try {
      // Verificar si tiene tareas asignadas
      const { default: Tarea } = await import("../models/Tarea.js");
      const tareasAsignadas = await Tarea.countDocuments({
        empleado: req.params.id,
        estado: { $in: ["pendiente", "en proceso"] },
        activo: true, // <-- ¡LA CORRECCIÓN! Solo contar tareas activas.
      });

      if (tareasAsignadas > 0) {
        // Redirigir a la lista con un mensaje de error en la URL
        const mensajeError = `No se puede eliminar: el empleado tiene ${tareasAsignadas} tarea/s pendiente/s o en proceso.`;
        return res.redirect(
          `/empleados?error=${encodeURIComponent(mensajeError)}`
        );
      }

      // Soft delete: marcar como inactivo en lugar de borrar
      await Empleado.findByIdAndUpdate(req.params.id, { activo: false });

      console.log(`🗑️ Empleado eliminado: ${req.params.id}`);
      res.redirect("/empleados");
    } catch (error) {
      console.error("Error eliminando empleado:", error);
      res.status(500).render("error", {
        mensaje: "Error al eliminar empleado",
      });
    }
  },

  // --- MÉTODOS PARA LA API ---

  // GET /api/empleados
  async getAllApi(req, res) {
    try {
      const empleados = await Empleado.find({ activo: true })
        .populate("rol", "nombre")
        .populate("area", "nombre");
      res.json(empleados);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Error al obtener empleados" });
    }
  },

  // GET /api/empleados/:id
  async getByIdApi(req, res) {
    try {
      const empleado = await Empleado.findById(req.params.id)
        .populate("rol", "nombre")
        .populate("area", "nombre");

      if (!empleado || !empleado.activo) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }
      res.json(empleado);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Error al obtener empleado" });
    }
  },

  // POST /api/empleados
  async createApi(req, res) {
    try {
      const nuevoEmpleado = await Empleado.create(req.body);
      res.status(201).json(nuevoEmpleado);
    } catch (error) {
      console.error("API Error:", error);
      // Manejo de errores de validación o duplicados
      if (error.name === "ValidationError" || error.code === 11000) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Error al crear empleado" });
    }
  },

  // PUT /api/empleados/:id
  async updateApi(req, res) {
    try {
      const empleadoActualizado = await Empleado.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!empleadoActualizado) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }
      res.json(empleadoActualizado);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Error al actualizar empleado" });
    }
  },

  // DELETE /api/empleados/:id
  async destroyApi(req, res) {
    try {
      // --- REUTILIZAR LA LÓGICA DE VALIDACIÓN DE LA RUTA WEB ---
      const { default: Tarea } = await import("../models/Tarea.js");
      const tareasAsignadas = await Tarea.countDocuments({
        empleado: req.params.id,
        estado: { $in: ["pendiente", "en proceso"] },
        activo: true, // <-- ¡LA CORRECCIÓN CLAVE! Solo contar tareas activas.
      });

      if (tareasAsignadas > 0) {
        // Devolver un error 400 (Bad Request) en formato JSON
        return res.status(400).json({
          error: `No se puede eliminar: el empleado tiene ${tareasAsignadas} tareas pendientes o en proceso.`,
        });
      }

      await Empleado.softDelete(req.params.id);
      res.status(204).send(); // 204 No Content es estándar para DELETE exitoso
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Error al eliminar empleado" });
    }
  },
};

export default empleadoController;

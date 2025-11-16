import mongoose from "mongoose";
import dotenv from "dotenv";
import Rol from "../models/Rol.js";
import Area from "../models/Area.js";
import Evento from "../models/Evento.js";

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" Conectado a MongoDB para poblar datos...");

    // Limpiar datos existentes
    await Rol.deleteMany({});
    await Area.deleteMany({});
    await Evento.deleteMany({});

    // Crear roles
    const roles = await Rol.create([
      {
        nombre: "administrador",
        descripcion: "Acceso completo al sistema",
        permisos: ["crear", "leer", "actualizar", "eliminar"],
      },
      {
        nombre: "planner",
        descripcion: "Planificador de eventos",
        permisos: ["crear", "leer", "actualizar"],
      },
      {
        nombre: "coordinador",
        descripcion: "Coordinador de tareas",
        permisos: ["leer", "actualizar"],
      },
    ]);

    // Crear áreas
    const areas = await Area.create([
      {
        nombre: "Producción y Logística",
        descripcion:
          "Coordinación con proveedores, montaje, verificación técnica",
        color: "#FF6B6B",
      },
      {
        nombre: "Planificación y Finanzas",
        descripcion: "Control de presupuesto, contratos, cronogramas",
        color: "#4ECDC4",
      },
      {
        nombre: "Atención al Cliente",
        descripcion: "Gestión de clientes y comunicación",
        color: "#45B7D1",
      },
      {
        nombre: "Administración",
        descripcion: "Gestión administrativa general",
        color: "#96CEB4",
      },
    ]);

    console.log(`✅ ${roles.length} roles creados`);
    console.log(`✅ ${areas.length} áreas creadas`);

    // Precargar 3 eventos random
    const eventos = await Evento.create([
      {
        nombre: "Fiesta Empresarial",
        descripcion: "Evento corporativo para networking y celebración anual.",
        fecha: new Date("2025-11-15"),
        lugar: "Hotel Central",
        cliente: "Empresa XYZ",
        activo: true,
      },
      {
        nombre: "Boda de Juan y Ana",
        descripcion: "Ceremonia y fiesta de casamiento.",
        fecha: new Date("2025-12-05"),
        lugar: "Quinta Los Álamos",
        cliente: "Juan y Ana",
        activo: true,
      },
      {
        nombre: "Conferencia Tech 2025",
        descripcion: "Conferencia internacional de tecnología e innovación.",
        fecha: new Date("2026-01-20"),
        lugar: "Centro de Convenciones",
        cliente: "TechWorld",
        activo: true,
      },
    ]);
    eventos.forEach((ev) => console.log(` Evento precargado: ${ev.nombre}`));

    process.exit(0);
  } catch (error) {
    console.error(" Error poblando base de datos:", error);
    process.exit(1);
  }
}

seedDatabase();

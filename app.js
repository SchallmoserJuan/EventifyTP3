import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import "./src/config/database.js"; // 

// CARLOS -> Importar rutas
import empleadoRoutes from "./src/routes/empleadoRoutes.js";
import tareaRoutes from "./src/routes/tareaRoutes.js";
import empleadoApiRoutes from "./src/routes/empleadoApiRoutes.js";
import tareaApiRoutes from "./src/routes/tareaApiRoutes.js";

// SOFIA -> Configurar __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// SOFIA -> Configuración de Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src/views"));

// NAHIR -> Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// NAHIR -> Middleware personalizado para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CARLOS -> Rutas principales
app.get("/", (req, res) => {
  res.render("index", {
    titulo: "Eventify - Sistema de Gestión de Eventos",
    mensaje:
      "Bienvenido al sistema de gestión integral de eventos (MongoDB Edition)",
  });
});

// CARLOS -> Rutas de empleados
app.use("/empleados", empleadoRoutes);
// CARLOS -> Rutas de tareas
app.use("/tareas", tareaRoutes);
app.use("/api/empleados", empleadoApiRoutes); // Ruta API para empleados
app.use("/api/tareas", tareaApiRoutes); // Ruta API para tareas

// NAHIR -> Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    titulo: "Error del Servidor",
    mensaje:
      process.env.NODE_ENV !== "production"
        ? err.message
        : "Ha ocurrido un error interno",
  });
});

// NAHIR -> Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).render("error", {
    titulo: "Página no encontrada",
    mensaje: "La página que buscas no existe",
  });
});

app.listen(PORT, () => {
  console.log(` Servidor Eventify corriendo en http://localhost:${PORT}`);
  console.log(` Entorno: ${process.env.NODE_ENV || "development"}`);
});

export default app;

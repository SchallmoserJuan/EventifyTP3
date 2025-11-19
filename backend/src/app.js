import express from "express";
import cors from "cors";
import methodOverride from "method-override";
import morgan from "morgan";
import dotenv from "dotenv";
import "./config/database.js";
import empleadoRoutes from "./routes/empleado.routes.js";
import tareaRoutes from "./routes/tarea.routes.js";
import eventoRoutes from "./routes/evento.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { authGuard } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    name: "Eventify API",
    version: "3.0",
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/empleados", authGuard, empleadoRoutes);
app.use("/api/tareas", authGuard, tareaRoutes);
app.use("/api/eventos", authGuard, eventoRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.path} no encontrada` });
});

app.use((err, _req, res, _next) => {
  console.error("Eventify error:", err);
  res.status(500).json({
    error: "Ha ocurrido un error interno",
    detail: process.env.NODE_ENV !== "production" ? err.message : undefined,
  });
});

export default app;

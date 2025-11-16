import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authGuard(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.sub);
    if (!user || user.activo === false) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.user = {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No tienes permisos suficientes" });
    }
    next();
  };
}

import jwt from "jsonwebtoken";
import User from "../models/User.js";

const buildToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

const publicUser = (user) => ({
  id: user._id,
  nombre: user.nombre,
  email: user.email,
  role: user.role,
});

export async function register(req, res) {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(400).json({ error: "Ya existe un usuario con ese email" });
    }

    const totalUsers = await User.countDocuments();
    const role =
      totalUsers === 0
        ? req.body.role || "admin"
        : req.body.role && req.user?.role === "admin"
          ? req.body.role
          : "viewer";

    const user = await User.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password: req.body.password,
      role,
    });

    const token = buildToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    console.error("Error registrando usuario:", error);
    res.status(500).json({ error: "Error registrando usuario" });
  }
}

export async function login(req, res) {
  try {
    const user = await User.findOne({
      email: req.body.email?.toLowerCase(),
      activo: { $ne: false },
    }).select("+password");

    if (!user || !(await user.comparePassword(req.body.password || ""))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = buildToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

export async function me(req, res) {
  res.json({ data: publicUser(req.user) });
}

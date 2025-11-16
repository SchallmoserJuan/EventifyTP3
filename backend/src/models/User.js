import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const rolesDisponibles = ["admin", "manager", "viewer"];

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minlength: 3,
      maxlength: 80,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: rolesDisponibles,
      default: "viewer",
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

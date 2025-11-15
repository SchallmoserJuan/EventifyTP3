import mongoose from "mongoose";

// 1. DEFINIR EL SCHEMA (la "estructura" del empleado)
const empleadoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
      trim: true, // Elimina espacios al inicio/final automáticamente
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true, // MongoDB asegura que no haya emails duplicados
      lowercase: true, // Convierte a minúsculas automáticamente
      match: [/\S+@\S+\.\S+/, "Email inválido"], // Validación con regex
    },

    // En lugar de rolId, vamos a referenciar al documento completo
    rol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rol", // Referencia al modelo Rol
      required: [true, "El rol es obligatorio"],
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area", // Referencia al modelo Area
      required: [true, "El área es obligatoria"],
    },

    fechaIngreso: {
      type: Date,
      default: Date.now, // Se asigna automáticamente al crear
    },

    activo: {
      type: Boolean,
      default: true, // Para "soft delete" (marcar como inactivo en lugar de borrar)
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// 2. CREAR ÍNDICES PARA PERFORMANCE
empleadoSchema.index({ email: 1 }); // Índice en email para búsquedas rápidas
empleadoSchema.index({ activo: 1 }); // Para filtrar empleados activos

// 3. MÉTODOS VIRTUALES (campos calculados)
empleadoSchema.virtual("nombreCompleto").get(function () {
  return `${this.nombre} (${this.email})`;
});

// 4. MIDDLEWARE PRE/POST (se ejecutan antes/después de operaciones)
empleadoSchema.pre("save", function (next) {
  console.log(`💾 Guardando empleado: ${this.nombre}`);
  next();
});

// 5. MÉTODOS ESTÁTICOS (equivalentes a los que tenías en FileManager)
empleadoSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

empleadoSchema.statics.softDelete = function (id) {
  // Marcar como inactivo en lugar de borrar permanentemente
  return this.findByIdAndUpdate(id, { activo: false });
};

// 6. CREAR EL MODELO
const Empleado = mongoose.model("Empleado", empleadoSchema);

export default Empleado;

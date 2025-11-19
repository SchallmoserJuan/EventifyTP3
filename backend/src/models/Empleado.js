import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email inválido"],
    },

    rol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rol",
      required: [true, "El rol es obligatorio"],
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: [true, "El área es obligatoria"],
    },

    fechaIngreso: {
      type: Date,
      default: Date.now,
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

empleadoSchema.index({ activo: 1 }); 

empleadoSchema.virtual("nombreCompleto").get(function () {
  return `${this.nombre} (${this.email})`;
});

empleadoSchema.pre("save", function (next) {
  console.log(`💾 Guardando empleado: ${this.nombre}`);
  next();
});

empleadoSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

empleadoSchema.statics.softDelete = function (id) {
  return this.findByIdAndUpdate(id, { activo: false });
};

const Empleado = mongoose.model("Empleado", empleadoSchema);

export default Empleado;

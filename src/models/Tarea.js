import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: 100,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    estado: {
      type: String,
      enum: ["pendiente", "en proceso", "finalizada"],
      default: "pendiente",
    },
    prioridad: {
      type: String,
      enum: ["alta", "media", "baja"],
      default: "media",
    },
    fechaInicio: {
      type: Date,
      default: Date.now,
    },
    fechaFin: {
      type: Date,
    },
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },
    evento: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Evento",
      required: true,
    },
    horasEstimadas: {
      type: Number,
      default: 0,
    },
    horasReales: {
      type: Number,
      default: 0,
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

tareaSchema.index({ estado: 1 });
tareaSchema.index({ prioridad: 1 });
tareaSchema.index({ activo: 1 });

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;

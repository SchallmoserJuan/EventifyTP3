import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    fecha: {
      type: Date,
      required: true,
    },
    lugar: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    cliente: {
      type: String,
      trim: true,
      maxlength: 100,
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

const Evento = mongoose.model("Evento", eventoSchema);
export default Evento;

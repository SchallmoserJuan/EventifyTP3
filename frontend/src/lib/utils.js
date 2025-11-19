import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes) {
  return twMerge(clsx(...classes));
}

export const defaultEmployee = {
  nombre: "",
  email: "",
  rol: "",
  area: "",
};

export const defaultTask = {
  titulo: "",
  descripcion: "",
  prioridad: "",
  estado: "pendiente",
  empleado: "",
  evento: "",
  fechaInicio: "",
  fechaFin: "",
  horasEstimadas: 1,
  horasReales: 0,
};

export const defaultEvent = {
  nombre: "",
  descripcion: "",
  fecha: "",
  lugar: "",
  cliente: "",
};

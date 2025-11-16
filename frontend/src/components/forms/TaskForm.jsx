import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../ui/Input.jsx";
import Textarea from "../ui/Textarea.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";

const schema = z
  .object({
    titulo: z.string().min(3, "Añade un título"),
    descripcion: z.string().optional(),
    estado: z.string().min(1, "Selecciona un estado"),
    prioridad: z.string().min(1, "Selecciona una prioridad"),
    empleado: z.string().min(1, "Selecciona un empleado"),
    evento: z.string().min(1, "Selecciona un evento"),
    fechaInicio: z.string().min(1, "Selecciona una fecha"),
    fechaFin: z.string().min(1, "Selecciona una fecha"),
    horasEstimadas: z.coerce.number().min(1, "Mínimo 1 hora"),
    horasReales: z.coerce.number().min(0, "No puede ser negativo"),
  })
  .refine(
    (data) => new Date(data.fechaInicio) <= new Date(data.fechaFin),
    {
      message: "La fecha de fin debe ser posterior a la de inicio",
      path: ["fechaFin"],
    }
  );

function TaskForm({ defaultValues, options, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Título</label>
          <Input placeholder="Nombre de la tarea" {...register("titulo")} />
          {errors.titulo && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.titulo.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm text-slate-300">Prioridad</label>
          <Select {...register("prioridad")}>
            <option value="">Selecciona prioridad</option>
            {options.prioridades?.map((prioridad) => (
              <option key={prioridad} value={prioridad}>
                {prioridad}
              </option>
            ))}
          </Select>
          {errors.prioridad && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.prioridad.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-300">Descripción</label>
        <Textarea
          rows={4}
          placeholder="Añade detalles y contexto"
          {...register("descripcion")}
        />
        {errors.descripcion && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.descripcion.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Empleado</label>
          <Select {...register("empleado")}>
            <option value="">Selecciona un empleado</option>
            {options.empleados?.map((empleado) => (
              <option key={empleado._id} value={empleado._id}>
                {empleado.nombre}
              </option>
            ))}
          </Select>
          {errors.empleado && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.empleado.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm text-slate-300">Evento</label>
          <Select {...register("evento")}>
            <option value="">Selecciona un evento</option>
            {options.eventos?.map((evento) => (
              <option key={evento._id} value={evento._id}>
                {evento.nombre}
              </option>
            ))}
          </Select>
          {errors.evento && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.evento.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm text-slate-300">Estado</label>
          <Select {...register("estado")}>
            {options.estados?.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </Select>
          {errors.estado && (
            <p className="mt-1 text-xs text-rose-400">{errors.estado.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-slate-300">Fecha inicio</label>
          <Input type="date" {...register("fechaInicio")} />
          {errors.fechaInicio && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.fechaInicio.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm text-slate-300">Fecha fin</label>
          <Input type="date" {...register("fechaFin")} />
          {errors.fechaFin && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.fechaFin.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Horas estimadas</label>
          <Input
            type="number"
            min="1"
            {...register("horasEstimadas", { valueAsNumber: true })}
          />
          {errors.horasEstimadas && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.horasEstimadas.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm text-slate-300">Horas reales</label>
          <Input
            type="number"
            min="0"
            {...register("horasReales", { valueAsNumber: true })}
          />
          {errors.horasReales && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.horasReales.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar tarea"}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;

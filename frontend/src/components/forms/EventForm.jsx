import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input.jsx";
import Textarea from "@/components/ui/Textarea.jsx";
import Button from "@/components/ui/Button.jsx";

const schema = z.object({
  nombre: z.string().min(3, "El nombre es obligatorio"),
  descripcion: z.string().max(300).optional(),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  lugar: z.string().optional(),
  cliente: z.string().optional(),
});

function EventForm({ defaultValues, onSubmit, loading }) {
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
      <div>
        <label className="text-sm text-slate-300">Nombre</label>
        <Input placeholder="Evento anual" {...register("nombre")} />
        {errors.nombre && (
          <p className="mt-1 text-xs text-rose-400">{errors.nombre.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm text-slate-300">Descripción</label>
        <Textarea rows={3} placeholder="Detalles..." {...register("descripcion")} />
        {errors.descripcion && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.descripcion.message}
          </p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Fecha</label>
          <Input type="date" {...register("fecha")} />
          {errors.fecha && (
            <p className="mt-1 text-xs text-rose-400">{errors.fecha.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-slate-300">Lugar</label>
          <Input placeholder="Centro de convenciones..." {...register("lugar")} />
        </div>
      </div>
      <div>
        <label className="text-sm text-slate-300">Cliente</label>
        <Input placeholder="Empresa XYZ" {...register("cliente")} />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar evento"}
        </Button>
      </div>
    </form>
  );
}

export default EventForm;

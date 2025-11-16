import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";

const schema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  rol: z.string().min(1, "Selecciona un rol"),
  area: z.string().min(1, "Selecciona un área"),
});

function EmployeeForm({ defaultValues, options, onSubmit, loading }) {
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
        <Input placeholder="Nombre completo" {...register("nombre")} />
        {errors.nombre && (
          <p className="mt-1 text-xs text-rose-400">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-slate-300">Email</label>
        <Input placeholder="correo@empresa.com" {...register("email")} />
        {errors.email && (
          <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-slate-300">Rol</label>
        <Select {...register("rol")}>
          <option value="">Selecciona un rol</option>
          {options.roles?.map((rol) => (
            <option key={rol._id} value={rol._id}>
              {rol.nombre}
            </option>
          ))}
        </Select>
        {errors.rol && (
          <p className="mt-1 text-xs text-rose-400">{errors.rol.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-slate-300">Área</label>
        <Select {...register("area")}>
          <option value="">Selecciona un área</option>
          {options.areas?.map((area) => (
            <option key={area._id} value={area._id}>
              {area.nombre}
            </option>
          ))}
        </Select>
        {errors.area && (
          <p className="mt-1 text-xs text-rose-400">{errors.area.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}

export default EmployeeForm;

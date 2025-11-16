import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { ListChecks, SlidersHorizontal, UserRound, CalendarRange } from "lucide-react";

function TaskFilters({ filters, onChange, options, onReset }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
      <div className="flex items-center gap-2 text-slate-300">
        <SlidersHorizontal className="h-4 w-4" />
        <h4 className="text-sm font-semibold uppercase tracking-wide">
          Filtros
        </h4>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="flex items-center gap-2 text-xs uppercase text-slate-500">
            <ListChecks className="h-3 w-3" />
            Estado
          </label>
          <Select name="estado" value={filters.estado} onChange={handleChange}>
            <option value="">Todos</option>
            {options.estados?.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs uppercase text-slate-500">
            <CalendarRange className="h-3 w-3" />
            Prioridad
          </label>
          <Select
            name="prioridad"
            value={filters.prioridad}
            onChange={handleChange}
          >
            <option value="">Todas</option>
            {options.prioridades?.map((prioridad) => (
              <option key={prioridad} value={prioridad}>
                {prioridad}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs uppercase text-slate-500">
            <UserRound className="h-3 w-3" />
            Empleado
          </label>
          <Select
            name="empleadoId"
            value={filters.empleadoId}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {options.empleados?.map((empleado) => (
              <option key={empleado._id} value={empleado._id}>
                {empleado.nombre}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs uppercase text-slate-500">
            <CalendarRange className="h-3 w-3" />
            Evento
          </label>
          <Select
            name="eventoId"
            value={filters.eventoId}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            {options.eventos?.map((evento) => (
              <option key={evento._id} value={evento._id}>
                {evento.nombre}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onReset}>
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}

export default TaskFilters;

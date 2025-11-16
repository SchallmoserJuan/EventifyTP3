import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tareasApi } from "@/lib/api";
import { defaultTask } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import TaskForm from "@/components/forms/TaskForm.jsx";
import TableSkeleton from "@/components/TableSkeleton.jsx";
import { toast } from "sonner";

const normalizeTask = (task) => ({
  ...defaultTask,
  ...task,
  empleado: task?.empleado?._id ?? task?.empleado ?? "",
  evento: task?.evento?._id ?? task?.evento ?? "",
  fechaInicio: task?.fechaInicio ? task.fechaInicio.split("T")[0] : "",
  fechaFin: task?.fechaFin ? task.fechaFin.split("T")[0] : "",
  horasEstimadas: task?.horasEstimadas ?? 1,
  horasReales: task?.horasReales ?? 0,
  prioridad: task?.prioridad ?? "",
  estado: task?.estado ?? "pendiente",
});

function TaskEdit({ mode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();
  const taskId = params.id;
  const isEdit = mode === "edit";

  const { data: options, isLoading: optionsLoading } = useQuery({
    queryKey: ["tareas", "options"],
    queryFn: tareasApi.options,
  });

  const { data: tarea, isLoading: tareaLoading } = useQuery({
    queryKey: ["tareas", taskId],
    queryFn: () => tareasApi.get(taskId),
    enabled: isEdit && Boolean(taskId),
    select: normalizeTask,
  });

  const mutation = useMutation({
    mutationFn: (values) =>
      isEdit ? tareasApi.update(taskId, values) : tareasApi.create(values),
    onSuccess: () => {
      toast.success("Tarea guardada");
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      navigate("/tareas");
    },
    onError: (error) =>
      toast.error(error.response?.data?.error ?? "Error al guardar"),
  });

  if (optionsLoading || (isEdit && tareaLoading)) {
    return <TableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <p className="text-xs uppercase text-slate-400">
            {isEdit ? "Actualizar tarea" : "Nueva tarea"}
          </p>
          <CardTitle>
            {isEdit ? `Editando ${tarea?.titulo}` : "Crear tarea"}
          </CardTitle>
        </div>
        <Link
          to="/tareas"
          className="rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Volver
        </Link>
      </CardHeader>
      <CardContent>
        <TaskForm
          defaultValues={isEdit ? tarea : defaultTask}
          options={options ?? { empleados: [], eventos: [], estados: [], prioridades: [] }}
          onSubmit={(values) => mutation.mutate(values)}
          loading={mutation.isPending}
        />
      </CardContent>
    </Card>
  );
}

export default TaskEdit;

import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { tareasApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import TaskCard from "@/components/tasks/TaskCard.jsx";
import TaskFilters from "@/components/tasks/TaskFilters.jsx";
import ConfirmDialog from "@/components/ConfirmDialog.jsx";
import { toast } from "sonner";
import Loader from "@/components/Loader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const initialFilters = {
  estado: "",
  prioridad: "",
  empleadoId: "",
  eventoId: "",
};

function Tasks() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(initialFilters);
  const [confirmId, setConfirmId] = useState(null);
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "manager";
  const canDelete = user?.role === "admin";

  const { data: options, isLoading: optionsLoading } = useQuery({
    queryKey: ["tareas", "options"],
    queryFn: tareasApi.options,
  });

  const {
    data: tareas = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["tareas", filters],
    queryFn: () => tareasApi.list(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: tareasApi.remove,
    onSuccess: () => {
      toast.success("Tarea eliminada");
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      setConfirmId(null);
    },
    onError: () => toast.error("No se pudo eliminar la tarea"),
  });

  if (isLoading || optionsLoading) {
    return <Loader label="Cargando tareas" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-slate-400">Operativa</p>
            <CardTitle>Tareas</CardTitle>
          </div>
          {canManage && (
            <Link
              to="/tareas/nueva"
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Nueva tarea
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <TaskFilters
            filters={filters}
            onChange={setFilters}
            options={options ?? {}}
            onReset={() => setFilters({ ...initialFilters })}
          />
          {isFetching && (
            <p className="mt-4 text-sm text-slate-400">Actualizando...</p>
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {tareas.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-400"
                >
                  No se encontraron tareas.
                </motion.p>
              ) : (
                tareas.map((tarea) => {
                  const id = tarea._id ?? tarea.id;
                  return (
                    <TaskCard
                      key={id}
                      tarea={tarea}
                      onDelete={(taskId) => setConfirmId(taskId)}
                      canEdit={canManage}
                      canDelete={canDelete}
                    />
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Eliminar tarea"
        description="Confirma para archivar la tarea."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => confirmId && deleteMutation.mutate(confirmId)}
      />
    </div>
  );
}

export default Tasks;

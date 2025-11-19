import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api";
import { defaultEvent } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import EventForm from "@/components/forms/EventForm.jsx";
import TableSkeleton from "@/components/TableSkeleton.jsx";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext.jsx";

function EventEdit({ mode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams();
  const eventId = params.id;
  const isEdit = mode === "edit";
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "manager";

  const { data: evento, isLoading } = useQuery({
    queryKey: ["eventos", eventId],
    queryFn: () => eventsApi.get(eventId),
    select: (evento) => ({
      ...defaultEvent,
      ...evento,
      fecha: evento?.fecha ? evento.fecha.split("T")[0] : "",
    }),
    enabled: isEdit && Boolean(eventId),
  });

  const mutation = useMutation({
    mutationFn: (values) =>
      isEdit ? eventsApi.update(eventId, values) : eventsApi.create(values),
    onSuccess: () => {
      toast.success("Evento guardado");
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      navigate("/eventos");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error ?? "Error al guardar evento");
    },
  });

  if (!canManage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin permisos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            Tu rol actual no permite modificar eventos.
          </p>
          <Link
            to="/eventos"
            className="mt-4 inline-flex rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Volver
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isEdit && isLoading) {
    return <TableSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-400">
            {isEdit ? "Actualizar evento" : "Nuevo evento"}
          </p>
          <CardTitle>
            {isEdit ? `Editando ${evento?.nombre}` : "Registrar evento"}
          </CardTitle>
        </div>
        <Link
          to="/eventos"
          className="rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Volver
        </Link>
      </CardHeader>
      <CardContent>
        <EventForm
          defaultValues={isEdit ? evento : defaultEvent}
          onSubmit={(values) => mutation.mutate(values)}
          loading={mutation.isPending}
        />
      </CardContent>
    </Card>
  );
}

export default EventEdit;

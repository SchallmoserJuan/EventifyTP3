import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { eventsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import { Table, TableBody, TableHead, TableHeaderRow, Th, Td } from "@/components/ui/Table.jsx";
import ConfirmDialog from "@/components/ConfirmDialog.jsx";
import { toast } from "sonner";
import Loader from "@/components/Loader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

function Events() {
  const queryClient = useQueryClient();
  const [confirmId, setConfirmId] = useState(null);
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "manager";
  const canDelete = user?.role === "admin";

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ["eventos"],
    queryFn: eventsApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: eventsApi.remove,
    onSuccess: () => {
      toast.success("Evento eliminado");
      queryClient.invalidateQueries({ queryKey: ["eventos"] });
      setConfirmId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error ?? "No se pudo eliminar");
    },
  });

  if (isLoading) {
    return <Loader label="Cargando eventos" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-slate-400">Calendario</p>
          <CardTitle>Eventos</CardTitle>
        </div>
        {canManage && (
          <Link
            to="/eventos/nuevo"
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Nuevo evento
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {eventos.length === 0 ? (
          <p className="text-slate-400">Aún no hay eventos registrados.</p>
        ) : (
          <Table>
            <TableHead>
              <TableHeaderRow>
                <Th>Nombre</Th>
                <Th>Fecha</Th>
                <Th>Lugar</Th>
                <Th>Cliente</Th>
                <Th className="text-right">Acciones</Th>
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              <AnimatePresence initial={false}>
                {eventos.map((evento) => (
                  <motion.tr
                    key={evento._id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="border-t border-white/5 transition hover:bg-white/5"
                  >
                    <Td>{evento.nombre}</Td>
                    <Td>{new Date(evento.fecha).toLocaleDateString("es-AR")}</Td>
                    <Td>{evento.lugar || "Sin definir"}</Td>
                    <Td>{evento.cliente || "Sin cliente"}</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        {canManage && (
                          <Link
                            to={`/eventos/${evento._id}`}
                            className="rounded-md border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/10"
                          >
                            Editar
                          </Link>
                        )}
                        {canDelete && (
                          <Button
                            variant="destructive"
                            className="px-3 py-1 text-xs"
                            onClick={() => setConfirmId(evento._id)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </Td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </CardContent>
      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Eliminar evento"
        description="No podrás recuperar esta información."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => confirmId && deleteMutation.mutate(confirmId)}
      />
    </Card>
  );
}

export default Events;

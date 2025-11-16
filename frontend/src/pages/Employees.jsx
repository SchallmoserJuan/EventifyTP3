import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { empleadosApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import { Table, TableBody, TableHead, TableHeaderRow, Th, Td } from "@/components/ui/Table.jsx";
import ConfirmDialog from "@/components/ConfirmDialog.jsx";
import { toast } from "sonner";
import Loader from "@/components/Loader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

function Employees() {
  const queryClient = useQueryClient();
  const [confirmId, setConfirmId] = useState(null);
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "manager";
  const canDelete = user?.role === "admin";

  const { data: empleados = [], isLoading } = useQuery({
    queryKey: ["empleados"],
    queryFn: empleadosApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: empleadosApi.remove,
    onSuccess: () => {
      toast.success("Empleado eliminado");
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      setConfirmId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error ?? "No se pudo eliminar");
    },
  });

  if (isLoading) {
    return <Loader label="Cargando empleados" />;
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <p className="text-sm uppercase text-slate-400">Equipo</p>
          <CardTitle>Gestión de empleados</CardTitle>
        </div>
        {canManage && (
          <Link
            to="/empleados/nuevo"
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Nuevo empleado
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {empleados.length === 0 ? (
          <p className="text-slate-400">Aún no hay empleados registrados.</p>
        ) : (
          <Table>
            <TableHead>
              <TableHeaderRow>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th>Rol</Th>
                <Th>Área</Th>
                <Th className="text-right">Acciones</Th>
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              <AnimatePresence initial={false}>
                {empleados.map((empleado) => {
                  const empleadoId = empleado._id ?? empleado.id;
                  return (
                    <motion.tr
                      key={empleadoId}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      className="border-t border-white/5 transition hover:bg-white/5"
                    >
                      <Td>{empleado.nombre}</Td>
                      <Td>{empleado.email}</Td>
                      <Td>{empleado.rol?.nombre ?? "Sin rol"}</Td>
                      <Td>{empleado.area?.nombre ?? "Sin área"}</Td>
                      <Td className="text-right">
                        <div className="flex justify-end gap-2">
                          {canManage && (
                            <Link
                              to={`/empleados/${empleadoId}`}
                              className="rounded-md border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/10"
                            >
                              Editar
                            </Link>
                          )}
                          {canDelete && (
                            <Button
                              variant="destructive"
                              className="px-3 py-1 text-xs"
                              onClick={() => setConfirmId(empleadoId)}
                            >
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </Td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </CardContent>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Eliminar empleado"
        description="No podrás recuperar esta información."
        onCancel={() => setConfirmId(null)}
        onConfirm={() => confirmId && deleteMutation.mutate(confirmId)}
      />
    </Card>
  );
}

export default Employees;

import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { empleadosApi } from "@/lib/api";
import { defaultEmployee } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import EmployeeForm from "@/components/forms/EmployeeForm.jsx";
import TableSkeleton from "@/components/TableSkeleton.jsx";
import { toast } from "sonner";

function EmployeeEdit({ mode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams();
  const employeeId = params.id;
  const isEdit = mode === "edit";

  const { data: options, isLoading: optionsLoading } = useQuery({
    queryKey: ["empleados", "options"],
    queryFn: empleadosApi.options,
  });

  const { data: empleado, isLoading: empleadoLoading } = useQuery({
    queryKey: ["empleados", employeeId],
    queryFn: () => empleadosApi.get(employeeId),
    select: (empleado) => ({
      ...defaultEmployee,
      ...empleado,
      rol: empleado?.rol?._id ?? empleado?.rol ?? "",
      area: empleado?.area?._id ?? empleado?.area ?? "",
    }),
    enabled: isEdit && Boolean(employeeId),
  });

  const mutation = useMutation({
    mutationFn: (values) =>
      isEdit
        ? empleadosApi.update(employeeId, values)
        : empleadosApi.create(values),
    onSuccess: () => {
      toast.success("Empleado guardado");
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      navigate("/empleados");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error ?? "Error al guardar");
    },
  });

  if (optionsLoading || (isEdit && empleadoLoading)) {
    return <TableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <p className="text-xs uppercase text-slate-400">
            {isEdit ? "Actualizar empleado" : "Nuevo ingreso"}
          </p>
          <CardTitle>
            {isEdit ? `Editando ${empleado?.nombre}` : "Registrar empleado"}
          </CardTitle>
        </div>
        <Link
          to="/empleados"
          className="rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Volver
        </Link>
      </CardHeader>
      <CardContent>
        <EmployeeForm
          defaultValues={isEdit ? empleado : defaultEmployee}
          options={options ?? { roles: [], areas: [] }}
          onSubmit={(values) => mutation.mutate(values)}
          loading={mutation.isPending}
        />
      </CardContent>
    </Card>
  );
}

export default EmployeeEdit;

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, Clock, UsersRound, Trophy } from "lucide-react";
import { empleadosApi, tareasApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";

function Dashboard() {
  const { data: empleados = [] } = useQuery({
    queryKey: ["empleados"],
    queryFn: empleadosApi.list,
  });
  const { data: tareas = [] } = useQuery({
    queryKey: ["tareas", "dashboard"],
    queryFn: () => tareasApi.list(),
  });

  const tareasPendientes = tareas.filter((t) => t.estado === "pendiente").length;
  const tareasProceso = tareas.filter((t) => t.estado === "en proceso").length;
  const tareasFinalizadas = tareas.filter((t) => t.estado === "finalizada").length;

  const metrics = [
    {
      title: "Empleados activos",
      value: empleados.length,
      description: "Personas listas para operar",
      icon: UsersRound,
      color: "text-indigo-200",
    },
    {
      title: "Tareas pendientes",
      value: tareasPendientes,
      description: "Prioriza estas acciones",
      icon: Activity,
      color: "text-amber-200",
    },
    {
      title: "En proceso",
      value: tareasProceso,
      description: "Seguimiento activo",
      icon: Clock,
      color: "text-sky-200",
    },
    {
      title: "Finalizadas",
      value: tareasFinalizadas,
      description: "Resultados concretos",
      icon: Trophy,
      color: "text-emerald-200",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/40 via-blue-600/30 to-emerald-500/30 p-8 shadow-2xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">
          Eventify OS
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
          Gestiona empleados y tareas desde un solo panel
        </h1>
        <p className="mt-4 max-w-2xl text-slate-100">
          API en Express + MongoDB y un frontend moderno en React + Tailwind. Crea,
          actualiza y monitorea tu operación en tiempo real.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to="/empleados/nuevo"
            className="rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
          >
            Registrar empleado
          </Link>
          <Link
            to="/tareas/nueva"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Planificar tarea
          </Link>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardHeader className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <metric.icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle>{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-4xl font-bold ${metric.color}`}>
                  {metric.value}
                </p>
                <p className="text-sm text-slate-400">{metric.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;

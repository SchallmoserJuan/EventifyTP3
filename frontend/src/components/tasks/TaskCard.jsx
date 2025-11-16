import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Clock, UserRound } from "lucide-react";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

const estadoVariant = {
  pendiente: "warning",
  "en proceso": "default",
  finalizada: "success",
};

const prioridadVariant = {
  alta: "danger",
  media: "warning",
  baja: "default",
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("es-AR") : "Sin fecha";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <Icon className="h-4 w-4 text-slate-500" />
      <span className="text-xs uppercase text-slate-500">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  );
}

function TaskCard({ tarea, onDelete, canEdit, canDelete }) {
  const taskId = tarea._id ?? tarea.id;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-5 shadow-2xl"
      whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.4)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold">{tarea.titulo}</h4>
          <p className="text-sm text-slate-400">
            {tarea.evento?.nombre ?? "Sin evento"}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={prioridadVariant[tarea.prioridad] ?? "default"}>
            {tarea.prioridad?.toUpperCase()}
          </Badge>
          <Badge variant={estadoVariant[tarea.estado] ?? "default"}>
            {tarea.estado?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {tarea.descripcion && (
        <p className="mt-4 text-sm text-slate-300">{tarea.descripcion}</p>
      )}

      <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
        <InfoRow
          icon={UserRound}
          label="Empleado"
          value={tarea.empleado?.nombre ?? "No asignado"}
        />
        <InfoRow
          icon={Clock}
          label="Horas"
          value={`${tarea.horasReales ?? 0} / ${tarea.horasEstimadas}`}
        />
        <InfoRow
          icon={CalendarDays}
          label="Inicio"
          value={formatDate(tarea.fechaInicio)}
        />
        <InfoRow
          icon={CalendarDays}
          label="Fin"
          value={formatDate(tarea.fechaFin)}
        />
      </div>

      <div className="mt-5 flex justify-end gap-3">
        {canEdit && (
          <Link
            to={`/tareas/${taskId}`}
            className="rounded-md border border-white/20 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10"
          >
            Editar
          </Link>
        )}
        {canDelete && (
          <Button
            variant="destructive"
            className="text-xs px-4 py-2"
            onClick={() => onDelete(taskId)}
          >
            Eliminar
          </Button>
        )}
      </div>
    </motion.article>
  );
}

export default TaskCard;

import { NavLink, Link } from "react-router-dom";
import Button from "./ui/Button.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/empleados", label: "Empleados" },
  { to: "/tareas", label: "Tareas" },
];

function Header() {
  const { user, logout } = useAuth();
  const canManageTasks = user?.role === "admin" || user?.role === "manager";
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="text-xl font-semibold text-white">
          Eventify<span className="text-indigo-400">.AI</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-white"
                  : "text-slate-400 transition hover:text-white"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {canManageTasks && (
            <Link
              to="/tareas/nueva"
              className="hidden rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 sm:inline-flex"
            >
              Crear tarea
            </Link>
          )}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/80 text-sm font-semibold text-white">
              {user?.nombre?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="text-xs leading-tight text-slate-200">
              <p className="font-medium">{user?.nombre}</p>
              <p className="uppercase text-[10px] text-slate-400">{user?.role}</p>
            </div>
          </div>
          <Button variant="outline" className="px-3 py-1 text-xs" onClick={logout}>
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { toast } from "sonner";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
      toast.success("Bienvenido nuevamente");
    } catch (error) {
      const message = error.response?.data?.error ?? "Credenciales inválidas";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl backdrop-blur">
        <div>
          <p className="text-sm uppercase tracking-[0.4rem] text-slate-400">
            Eventify
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Ingresá al panel</h1>
          <p className="text-sm text-slate-400">
            Usa tus credenciales asignadas por un administrador.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <Input
              type="email"
              name="email"
              placeholder="tu@empresa.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Contraseña</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;

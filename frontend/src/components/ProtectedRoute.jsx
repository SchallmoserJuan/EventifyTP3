import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader label="Autenticando" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

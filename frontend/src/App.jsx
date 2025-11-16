import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import EmployeeEdit from "./pages/EmployeeEdit.jsx";
import Tasks from "./pages/Tasks.jsx";
import TaskEdit from "./pages/TaskEdit.jsx";
import Login from "./pages/Login.jsx";

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/empleados" element={<Employees />} />
          <Route path="/empleados/nuevo" element={<EmployeeEdit mode="create" />} />
          <Route path="/empleados/:id" element={<EmployeeEdit mode="edit" />} />
          <Route path="/tareas" element={<Tasks />} />
          <Route path="/tareas/nueva" element={<TaskEdit mode="create" />} />
          <Route path="/tareas/:id" element={<TaskEdit mode="edit" />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

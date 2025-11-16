import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const authApi = {
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data),
  register: (payload) => api.post("/auth/register", payload).then((res) => res.data),
  me: () => api.get("/auth/me").then((res) => res.data.data),
};

export const empleadosApi = {
  list: () => api.get("/empleados").then((res) => res.data.data),
  options: () => api.get("/empleados/options").then((res) => res.data),
  get: (id) => api.get(`/empleados/${id}`).then((res) => res.data.data),
  create: (payload) => api.post("/empleados", payload).then((res) => res.data.data),
  update: (id, payload) => api.put(`/empleados/${id}`, payload).then((res) => res.data.data),
  remove: (id) => api.delete(`/empleados/${id}`),
};

export const tareasApi = {
  list: (params) =>
    api
      .get("/tareas", { params })
      .then((res) => res.data.data),
  options: () => api.get("/tareas/options").then((res) => res.data),
  get: (id) => api.get(`/tareas/${id}`).then((res) => res.data.data),
  create: (payload) => api.post("/tareas", payload).then((res) => res.data.data),
  update: (id, payload) => api.put(`/tareas/${id}`, payload).then((res) => res.data.data),
  remove: (id) => api.delete(`/tareas/${id}`),
};

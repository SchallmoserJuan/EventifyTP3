# Eventify v3

Aplicacion de gestion de eventos con backend Node.js + Express + MongoDB y un frontend separado construido con React + Vite + Tailwind CSS (glassmorphism + Framer Motion).

## Arquitectura

```
EventifyTP3/
├── backend/                # API REST
│   ├── src/
│   │   ├── config/         # Conexion a MongoDB
│   │   ├── controllers/    # CRUD + auth
│   │   ├── middleware/     # authGuard y authorizeRoles
│   │   ├── models/         # Mongoose (empleados, tareas, usuarios, etc.)
│   │   ├── routes/         # /api/auth, /api/empleados, /api/tareas
│   │   └── server.js       # Bootstrap de Express
│   ├── package.json
│   └── .env                # PORT, MONGODB_URI, JWT_SECRET, FRONTEND_URL...
└── frontend/               # UI React + Tailwind
    ├── src/
    │   ├── components/     # Layout, UI reutilizable, animaciones
    │   ├── context/        # AuthProvider (JWT)
    │   ├── lib/            # Axios + helpers
    │   └── pages/          # Dashboard, Login, CRUDs
    ├── package.json
    └── .env                # VITE_API_URL
```

## Variables de entorno

`backend/.env`:
```env
PORT=4000
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=http://localhost:5173
JWT_SECRET=pon-tu-secreto-aqui
JWT_EXPIRES_IN=4h
```

`frontend/.env`:
```env
VITE_API_URL=http://localhost:4000/api
```

## Scripts

| Comando | Descripcion |
| --- | --- |
| `cd backend && npm install` | Instala dependencias de la API |
| `cd backend && npm run dev` | Arranca Express + MongoDB |
| `cd frontend && npm install` | Instala dependencias del cliente |
| `cd frontend && npm run dev` | Levanta Vite en `http://localhost:5173` |
| `cd backend && npm run seed` | Ejecuta el seed existente (opcional) |

## Seguridad (JWT + roles)

- Endpoints disponibles en `/api/auth`:
  - `POST /login` – recibe `{ email, password }` y devuelve `{ token, user }`.
  - `POST /register` – crea usuario (primer registro obtiene rol `admin` automaticamente). El resto se crea como `viewer` salvo que el request venga autenticado como admin.
  - `GET /me` – devuelve el perfil autenticado.
- Middleware `authGuard` protege `/api/empleados` y `/api/tareas`. El token se envia en el header `Authorization: Bearer <token>`.
- `authorizeRoles` aplica reglas: por ejemplo solo `admin` puede eliminar empleados/tareas, mientras que `viewer` puede listar.
- Usuarios se almacenan en `src/models/User.js` con contraseñas hasheadas (`bcryptjs`).

### Flujo sugerido
1. Arranca la API y realiza `POST /api/auth/register` con los datos del primer usuario (quedara como admin). Puedes hacerlo desde Thunder Client/Postman o creando temporalmente un formulario.
2. Inicia sesion desde `http://localhost:5173/login`. El frontend guarda el JWT en `localStorage` y lo adjunta automaticamente en todas las llamadas `axios`.
3. Desde el header puedes cerrar sesion y ver el rol actual.

## Frontend

- Enrutamiento protegido con `ProtectedRoute` (react-router-dom). Toda la app (dashboard, empleados, tareas) queda bajo `<AuthProvider>` + `<Layout>` y exige JWT valido.
- UI modernizada: componentes personalizados (botones gradiente, tablas glass, cards con hover), `lucide-react` para iconos y `framer-motion` para transiciones.
- Formularios controlados con React Hook Form + Zod (validaciones en el cliente) y feedback instantaneo con `sonner`.

## Resumen de migracion

1. Se eliminó Pug y se separaron capas backend/frontend.
2. Se añadieron controladores JSON para empleados y tareas reutilizando la logica original (soft delete, validaciones, populate).
3. Se construyó el frontend con Vite + Tailwind replicando las vistas (dashboard, listados, formularios, filtros) con componentes reutilizables.
4. Se integró autenticacion/rol basado en JWT para proteger la API y el panel.
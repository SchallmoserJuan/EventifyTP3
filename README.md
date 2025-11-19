# Eventify v3

Aplicación de gestión de eventos con backend Node.js + Express + MongoDB y un frontend moderno construido con React + Vite + Tailwind CSS.

## Arquitectura

```
EventifyTP3/
├── backend/                # API REST
│   ├── src/
│   │   ├── config/         # Conexión a MongoDB
│   │   ├── controllers/    # CRUD + auth (empleados, tareas, eventos)
│   │   ├── middleware/     # authGuard y authorizeRoles
│   │   ├── models/         # Mongoose (empleados, tareas, eventos, usuarios)
│   │   ├── routes/         # /api/auth, /api/empleados, /api/tareas, /api/eventos
│   │   └── server.js       # Bootstrap de Express
│   ├── package.json
│   └── .env                # PORT, MONGODB_URI, JWT_SECRET, FRONTEND_URL...
└── frontend/               # UI React + Tailwind
    ├── src/
    │   ├── components/     # Layout, UI glassmorphism, animaciones
    │   ├── context/        # AuthProvider (JWT)
    │   ├── lib/            # Axios + helpers
    │   └── pages/          # Dashboard, Login, CRUDs (empleados/tareas/eventos)
    ├── package.json
    └── .env                # VITE_API_URL
```

## Variables de entorno

`backend/.env`
```env
PORT=4000
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=http://localhost:5173
JWT_SECRET=pon-tu-secreto-aqui
JWT_EXPIRES_IN=4h
```

`frontend/.env`
```env
VITE_API_URL=http://localhost:4000/api
```

## Scripts principales

| Comando | Descripción |
| --- | --- |
| `cd backend && npm install` | Instala dependencias de la API |
| `cd backend && npm run dev` | Arranca Express + MongoDB |
| `cd backend && npm run seed` | Ejecuta el seed existente (opcional) |
| `cd backend && npm test`     | Corre pruebas Jest (usa MongoDB en memoria) |

### Testing

Se añadió una prueba de integración básica en `backend/tests/auth.test.js` utilizando **Jest**, **Supertest** y **mongodb-memory-server**. El flujo verificado es:

1. Registro de usuario (`POST /api/auth/register`).
2. Login con las credenciales recién creadas (`POST /api/auth/login`).
3. Consulta del perfil autenticado (`GET /api/auth/me`) enviando el JWT recibido.

La prueba levanta una base MongoDB en memoria, por lo que no requiere datos reales y se ejecuta de manera determinista. Para correrla:

```bash
cd backend
npm install        # si aún no instalaste devDependencies
npm test
```

Esto deja documentado el uso de prácticas de testing vistas en clase (Jest) y respalda el correcto funcionamiento del flujo de autenticación.
| `cd frontend && npm install` | Instala dependencias del cliente |
| `cd frontend && npm run dev` | Levanta Vite en `http://localhost:5173` |

## API y seguridad

- **Auth** (`/api/auth`): `POST /register`, `POST /login`, `GET /me`. Primer registro queda como `admin`. JWT firmado con `JWT_SECRET`.
- **Empleados** (`/api/empleados`): CRUD completo + `/options`. Protegido por `authGuard` y `authorizeRoles` (viewer solo lectura, manager crea/edita, admin también elimina).
- **Tareas** (`/api/tareas`): CRUD con filtros (`estado`, `prioridad`, `empleado`, `evento`) y `/options` para popular formularios.
- **Eventos** (`/api/eventos`): nuevo módulo CRUD para calendarizar eventos; se utiliza en el select de tareas.
- Para consumir la API necesitas enviar `Authorization: Bearer <token>`; el frontend lo hace automáticamente vía `AuthProvider`.

## Frontend

- React Router con `ProtectedRoute` asegura que todo el panel (dashboard, empleados, tareas, eventos) requiera login.
- React Query coordina llamadas a la API; React Hook Form + Zod validan formularios.
- Tailwind + componentes custom (botones gradiente, tablas glass, cards animadas) + `framer-motion`/`lucide-react`.
- Cada módulo respeta los permisos por rol (los viewers solo ven, managers crean/editar, admin borra).

## Resumen de migración

1. Se eliminó Pug y se separaron las capas backend/frontend.
2. Se reescribieron los controladores para servir JSON y se añadió autenticación JWT + roles.
3. Se construyó el frontend con Vite + Tailwind replicando los CRUDs (empleados, tareas) y **se añadió el CRUD completo de eventos**.
4. Se integró la autenticación/autoridad en toda la UI, se modernizó el diseño y se documentó el proceso para deploy (Render) con variables de entorno claras.

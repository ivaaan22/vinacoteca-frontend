# 🍷🍺 Vinacoteca — Frontend

Aplicación **React + Vite** que forma parte del proyecto fullstack **VINACOTECA** (IA3). Interfaz de usuario para consultar productos, registrarse con foto, hacer pedidos y gestionar el catálogo y usuarios desde dashboards diferenciados por rol.

## 🛠️ Stack

- **React 19** + **Vite 8**
- **React Router DOM 7** — navegación SPA
- **Axios** — peticiones HTTP con interceptores JWT
- **Context API** — gestión de estado global de autenticación
- Desplegado en **Vercel**

## 🌐 URLs del proyecto

| Servicio  | URL                                                        |
| --------- | ---------------------------------------------------------- |
| Frontend  | https://vinacoteca-frontend.vercel.app                     |
| Backend   | https://vinacoteca-backend-bztx.onrender.com               |

## 📋 Requisitos

- Node.js 18+
- El backend de Vinacoteca funcionando (local o desplegado)

## 🚀 Instalación

```bash
git clone https://github.com/ivaaan22/vinacoteca-frontend.git
cd vinacoteca-frontend
npm install
```

## 🔐 Variables de entorno

Crea un fichero `.env` en la raíz basándote en `.env.example`:

```env
VITE_API_URL=http://localhost:3001
```

| Variable       | Descripción                                  | Ejemplo                                        |
| -------------- | -------------------------------------------- | ---------------------------------------------- |
| `VITE_API_URL` | URL del backend (sin `/` al final)           | `http://localhost:3001` o URL de producción    |

> ⚠️ El fichero `.env` está en `.gitignore` y nunca debe subirse al repositorio.
> En producción (Vercel), configura `VITE_API_URL` en el panel de Environment Variables.

## ▶️ Ejecución

```bash
# Desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Previsualizar el build localmente
npm run preview
```

## 🗺️ Estructura

```
src/
├── api/
│   └── axios.js              # Cliente HTTP centralizado con interceptores
│                             # (token JWT automático, gestión 401/403)
├── components/
│   ├── Navbar.jsx            # Navegación con avatar de usuario y rol
│   └── RutaProtegida.jsx     # HOC: redirige si no hay token o rol incorrecto
├── context/
│   └── AuthContext.jsx       # Estado global: usuario, token, login(), logout()
│                             # Persistencia via localStorage
├── pages/
│   ├── Home.jsx              # Página de inicio (pública)
│   ├── Vins.jsx              # Catálogo de vinos (público)
│   ├── Cerveses.jsx          # Catálogo de cervezas (público)
│   ├── DetallVi.jsx          # Detalle de un vino + hacer pedido
│   ├── DetallCervesa.jsx     # Detalle de una cerveza + hacer pedido
│   ├── Login.jsx             # Formulario de login
│   ├── Registre.jsx          # Registro con subida de foto (multipart)
│   ├── Perfil.jsx            # Perfil del usuario autenticado + editar
│   ├── Comandes.jsx          # Mis pedidos
│   └── dashboard/
│       ├── DashboardEditor.jsx  # CRUD de productos (editor + admin)
│       └── DashboardAdmin.jsx   # CRUD productos + gestión usuarios/roles
├── App.jsx                   # Router principal con todas las rutas
└── main.jsx                  # Punto de entrada
```

## 👥 Rutas y permisos

| Ruta                      | Acceso                       | Descripción                              |
| ------------------------- | ---------------------------- | ---------------------------------------- |
| `/`                       | Público                      | Página de inicio                         |
| `/vins`                   | Público                      | Catálogo de vinos con imagen y precio    |
| `/vins/:id`               | Público                      | Detalle de vino + botón de pedido        |
| `/cerveses`               | Público                      | Catálogo de cervezas                     |
| `/cerveses/:id`           | Público                      | Detalle de cerveza + botón de pedido     |
| `/login`                  | Público                      | Iniciar sesión                           |
| `/registre`               | Público                      | Registro con foto (multipart/form-data)  |
| `/perfil`                 | Autenticado                  | Ver y editar el propio perfil            |
| `/comandes`               | Autenticado                  | Historial de pedidos propios             |
| `/dashboard`              | Editor o Admin               | CRUD de productos                        |
| `/dashboard/usuaris`      | Solo Admin                   | Gestión de usuarios y asignación de roles|

## 🔄 Casos de uso cubiertos (IA3)

| CU  | Descripción                                               | Estado |
| --- | --------------------------------------------------------- | :----: |
| CU1 | Consultar productos (público, sin login)                  | ✅     |
| CU2 | Registrarse con foto (multipart/form-data)                | ✅     |
| CU3 | Iniciar sesión y obtener token JWT                        | ✅     |
| CU4 | Hacer un pedido + correo de notificación al propietario   | ✅     |
| CU5 | Dashboard editor: CRUD de productos (vinos y cervezas)    | ✅     |
| CU6 | Dashboard admin: gestión de usuarios y asignación de roles| ✅     |

## 🔑 Credenciales de prueba

Para obtener las credenciales hay que ejecutar `node scripts/seed.js` en el backend.

| Rol    | Email             | Contraseña  | Acceso                                      |
| ------ | ----------------- | ----------- | ------------------------------------------- |
| Admin  | `admin@api.com`   | `admin123`  | Todo: CRUD productos + gestión de usuarios  |
| Editor | `editor@api.com`  | `editor123` | Dashboard CRUD de productos                 |
| Usuario| `usuari@api.com`  | `usuari123` | Catálogo + pedidos                          |

## 🛡️ Gestión de autenticación y errores

**Token JWT:**
- Se guarda en `localStorage` al hacer login o registro
- Se adjunta automáticamente a todas las peticiones via interceptor de Axios
- Se mantiene entre sesiones (persistencia al recargar la página)
- Se borra al hacer logout

**Errores HTTP:**
- **401** (no autenticado): el interceptor limpia la sesión y redirige a `/login`
- **403** (sin permisos): se muestra un mensaje claro sin cerrar sesión
- **404** (producto no encontrado): mensaje de error controlado en la página de detalle
- **Errores de red**: mensaje "No es pot connectar amb el servidor"

## 🌐 Despliegue en Vercel

1. Conecta el repo `ivaaan22/vinacoteca-frontend` a Vercel
2. **Settings → Environment Variables** → añade:
   - `VITE_API_URL` = `https://vinacoteca-backend-bztx.onrender.com`
3. Marca las 3 opciones: Production, Preview, Development
4. **Redeploy** (sin cache) después de cualquier cambio de variable
5. Comprueba que el backend tiene `FRONTEND_URL` apuntando al dominio de Vercel (para el CORS)

> ⚠️ El fichero `vercel.json` en la raíz configura el rewrite SPA: todas las rutas sirven `index.html` para que React Router las gestione en el cliente. Sin esto, recargar cualquier ruta que no sea `/` da 404.

## 🔗 Repositorios

| Proyecto           | GitHub                                                      |
| ------------------ | ----------------------------------------------------------- |
| Frontend (IA3)     | https://github.com/ivaaan22/vinacoteca-frontend             |
| Backend (IA2/IA3)  | https://github.com/ivaaan22/vinacoteca-backend              |

## 📝 Autoría

Proyecto realizado por **Ivan García Cuesta** como parte del IA3 del curso DAW2 (Desarrollo de Aplicaciones Web).

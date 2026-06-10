# 🍷🍺 Vinacoteca — Frontend

Aplicació **React + Vite** que forma part del projecte fullstack **VINACOTECA** (IA3). Interfície d'usuari per consultar productes, registrar-se amb foto, fer comandes i gestionar el catàleg i usuaris des de dashboards diferenciats per rol.

## 🛠️ Stack

- **React 19** + **Vite 8**
- **React Router DOM 7** — navegació SPA
- **Axios** — peticions HTTP amb interceptors JWT
- **Context API** — gestió d'estat global d'autenticació
- Desplegat a **Vercel**

## 🌐 URLs del projecte

| Servei   | URL                                                        |
| -------- | ---------------------------------------------------------- |
| Frontend | https://vinacoteca-frontend.vercel.app                     |
| Backend  | https://vinacoteca-backend-1.onrender.com                  |

## 📋 Requisits

- Node.js 18+
- El backend de Vinacoteca funcionant (local o desplegat)

## 🚀 Instal·lació

```bash
git clone https://github.com/ivaaan22/vinacoteca-frontend.git
cd vinacoteca-frontend
npm install
```

## 🔐 Variables d'entorn

Crea un fitxer `.env` a l'arrel basant-te en `.env.example`:

```env
VITE_API_URL=http://localhost:3001
```

| Variable       | Descripció                                  | Exemple                                        |
| -------------- | ------------------------------------------- | ---------------------------------------------- |
| `VITE_API_URL` | URL del backend (sense `/` al final)        | `http://localhost:3001` o URL de producció     |

> ⚠️ El fitxer `.env` és al `.gitignore` i mai s'ha de pujar al repositori.
> En producció (Vercel), configura `VITE_API_URL` al panell d'Environment Variables.

## ▶️ Execució

```bash
# Desenvolupament (http://localhost:5173)
npm run dev

# Build de producció
npm run build

# Previsualitzar el build localment
npm run preview
```

## 🗺️ Estructura

```
src/
├── api/
│   └── axios.js              # Client HTTP centralitzat amb interceptors
│                             # (token JWT automàtic, gestió 401/403)
├── components/
│   ├── Navbar.jsx            # Navegació amb avatar d'usuari i rol
│   └── RutaProtegida.jsx     # HOC: redirigeix si no hi ha token o rol incorrecte
├── context/
│   └── AuthContext.jsx       # Estat global: usuari, token, login(), logout()
│                             # Persistència via localStorage
├── pages/
│   ├── Home.jsx              # Pàgina d'inici (pública)
│   ├── Vins.jsx              # Catàleg de vins (públic)
│   ├── Cerveses.jsx          # Catàleg de cerveses (públic)
│   ├── DetallVi.jsx          # Detall d'un vi + fer comanda
│   ├── DetallCervesa.jsx     # Detall d'una cervesa + fer comanda
│   ├── Login.jsx             # Formulari de login
│   ├── Registre.jsx          # Registre amb pujada de foto (multipart)
│   ├── Perfil.jsx            # Perfil de l'usuari autenticat + editar
│   ├── Comandes.jsx          # Les meves comandes
│   └── dashboard/
│       ├── DashboardEditor.jsx  # CRUD de productes (editor + admin)
│       └── DashboardAdmin.jsx   # CRUD productes + gestió usuaris/rols
├── App.jsx                   # Router principal amb totes les rutes
└── main.jsx                  # Punt d'entrada
```

## 👥 Rutes i permisos

| Ruta                      | Accés                        | Descripció                              |
| ------------------------- | ---------------------------- | --------------------------------------- |
| `/`                       | Públic                       | Pàgina d'inici                          |
| `/vins`                   | Públic                       | Catàleg de vins amb imatge i preu       |
| `/vins/:id`               | Públic                       | Detall de vi + botó de comanda          |
| `/cerveses`               | Públic                       | Catàleg de cerveses                     |
| `/cerveses/:id`           | Públic                       | Detall de cervesa + botó de comanda     |
| `/login`                  | Públic                       | Iniciar sessió                          |
| `/registre`               | Públic                       | Registre amb foto (multipart/form-data) |
| `/perfil`                 | Autenticat                   | Veure i editar el propi perfil          |
| `/comandes`               | Autenticat                   | Historial de comandes pròpies           |
| `/dashboard`              | Editor o Admin               | CRUD de productes                       |
| `/dashboard/usuaris`      | Només Admin                  | Gestió d'usuaris i assignació de rols   |

## 🔄 Casos d'ús coberts (IA3)

| CU  | Descripció                                               | Estat |
| --- | -------------------------------------------------------- | :---: |
| CU1 | Consultar productes (públic, sense login)                | ✅    |
| CU2 | Registrar-se amb foto (multipart/form-data)              | ✅    |
| CU3 | Iniciar sessió i obtenir token JWT                       | ✅    |
| CU4 | Fer una comanda + correu de notificació al propietari    | ✅    |
| CU5 | Dashboard editor: CRUD de productes (vins i cerveses)    | ✅    |
| CU6 | Dashboard admin: gestió d'usuaris i assignació de rols   | ✅    |

## 🔑 Credencials de prova

Per obtenir les credencials cal executar `node scripts/seed.js` al backend.

| Rol    | Email             | Contrasenya | Accés                                      |
| ------ | ----------------- | ----------- | ------------------------------------------ |
| Admin  | `admin@api.com`   | `admin123`  | Tot: CRUD productes + gestió d'usuaris     |
| Editor | `editor@api.com`  | `editor123` | Dashboard CRUD de productes                |
| Usuari | `usuari@api.com`  | `usuari123` | Catàleg + comandes                         |

## 🛡️ Gestió d'autenticació i errors

**Token JWT:**
- Es guarda a `localStorage` en fer login o registre
- S'adjunta automàticament a totes les peticions via interceptor d'Axios
- Es manté entre sessions (persistència en recarregar la pàgina)
- S'esborra en fer logout

**Errors HTTP:**
- **401** (no autenticat): l'interceptor neteja la sessió i redirigeix a `/login`
- **403** (sense permisos): es mostra un missatge clar sense tancar sessió
- **404** (producte no trobat): missatge d'error controlat a la pàgina de detall
- **Errors de xarxa**: missatge "No es pot connectar amb el servidor"

## 🌐 Desplegament a Vercel

1. Connecta el repo `ivaaan22/vinacoteca-frontend` a Vercel
2. **Settings → Environment Variables** → afegeix:
   - `VITE_API_URL` = `https://vinacoteca-backend-1.onrender.com`
3. Marca les 3 opcions: Production, Preview, Development
4. **Redeploy** (sense cache) després de qualsevol canvi de variable
5. Comprova que el backend té `FRONTEND_URL` apuntant al domini de Vercel (per al CORS)

> ⚠️ El fitxer `vercel.json` de l'arrel configura el rewrite SPA: totes les rutes serveixen `index.html` perquè React Router les gestioni al client. Sense això, recarregar qualsevol ruta que no sigui `/` dona 404.

## 🔗 Repositoris

| Projecte         | GitHub                                                      |
| ---------------- | ----------------------------------------------------------- |
| Frontend (IA3)   | https://github.com/ivaaan22/vinacoteca-frontend             |
| Backend (IA2/IA3)| https://github.com/ivaaan22/vinacoteca-backend              |

## 📝 Autoria

Projecte realitzat per **Ivan García Cuesta** com a part de l'IA3 del curs DAW2 (Desenvolupament d'Aplicacions Web).

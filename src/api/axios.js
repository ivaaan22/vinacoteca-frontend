import axios from 'axios'

// Treu barres finals per evitar URLs com "https://api.com//endpoint"
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_URL
})

// Adjunta el token JWT a cada petició si existeix
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el backend retorna 401 en una ruta protegida que NO sigui auth, neteja la sessió.
// Les rutes /api/auth/ (login, registre, perfil) gestionen l'error pel seu compte.
api.interceptors.response.use(
  res => res,
  err => {
    const url = err.config?.url ?? ''
    const esRutaAuth = url.includes('/api/auth/')

    if (err.response?.status === 401 && !esRutaAuth) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuari')
      // Evitem bucles: només redirigim si no estem ja al login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(err)
  }
)

export { API_URL }
export default api

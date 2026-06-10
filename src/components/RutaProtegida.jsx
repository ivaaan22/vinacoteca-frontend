import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Ruta que requereix autenticació i opcionalment un rol concret
export default function RutaProtegida({ children, rols = [] }) {
  const { usuari, loading } = useAuth()

  if (loading) return <div className="loading">Carregant...</div>
  if (!usuari) return <Navigate to="/login" replace />
  if (rols.length > 0 && !rols.includes(usuari.rol)) return <Navigate to="/" replace />

  return children
}

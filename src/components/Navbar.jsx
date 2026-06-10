import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../api/axios'
import './Navbar.css'

export default function Navbar() {
  const { usuari, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Construeix la URL completa de la foto:
  // - Si ja és una URL absoluta (http/https) → la usem tal qual
  // - Si és una ruta relativa (uploads/xxx.jpg) → prefixem amb la URL del backend
  const urlFoto = usuari?.foto
    ? (usuari.foto.startsWith('http') ? usuari.foto : `${API_URL}/${usuari.foto}`)
    : null

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🍷 Vinacoteca
      </Link>
      <div className="navbar-links">
        <Link to="/vins">Vins</Link>
        <Link to="/cerveses">Cerveses</Link>

        {!usuari ? (
          <>
            <Link to="/login" className="btn-nav">Entrar</Link>
            <Link to="/registre" className="btn-nav btn-outline">Registrar-se</Link>
          </>
        ) : (
          <>
            {(usuari.rol === 'editor' || usuari.rol === 'admin') && (
              <Link to="/dashboard">Dashboard</Link>
            )}
            {usuari.rol === 'admin' && (
              <Link to="/dashboard/usuaris">Usuaris</Link>
            )}
            <Link to="/comandes">Les meves comandes</Link>
            <Link to="/perfil" className="navbar-perfil">
              {urlFoto ? (
                <img
                  src={urlFoto}
                  alt={usuari.email}
                  className="navbar-avatar"
                  onError={e => {
                    // Si la foto falla, mostrem l'emoji
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'inline'
                  }}
                />
              ) : null}
              <span className="navbar-avatar-emoji" style={{ display: urlFoto ? 'none' : 'inline' }}>👤</span>
              <span className="navbar-email">{usuari.email}</span>
            </Link>
            <button onClick={handleLogout} className="btn-nav btn-logout">Sortir</button>
          </>
        )}
      </div>
    </nav>
  )
}

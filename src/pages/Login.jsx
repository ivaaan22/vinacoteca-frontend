import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password
      })

      // Robustesa: el backend pot variar el nom del camp
      const usuariRebut = data.usuari ?? data.user ?? data.usuario ?? null
      const tokenRebut = data.token ?? data.accessToken ?? null

      if (!tokenRebut) {
        setError('Resposta del servidor incorrecta: falta el token.')
        return
      }
      if (!usuariRebut) {
        setError("Resposta del servidor incorrecta: falten les dades de l'usuari.")
        return
      }

      login(tokenRebut, usuariRebut)

      const rol = usuariRebut.rol
      if (rol === 'admin' || rol === 'editor') {
        navigate('/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      const msg = err.response?.data?.error
        || err.response?.data?.message
        || (err.code === 'ERR_NETWORK' ? 'No es pot connectar amb el servidor.' : 'Error en iniciar sessió')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🍷</div>
        <h1>Inicia sessió</h1>
        <p className="auth-sub">Accedeix al teu compte de Vinacoteca</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email
            <input type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="correu@exemple.cat"
              autoComplete="email" />
          </label>
          <label>Contrasenya
            <input type="password" name="password" value={form.password}
              onChange={handleChange} required placeholder="••••••••"
              autoComplete="current-password" />
          </label>
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Entrant...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-link">No tens compte? <Link to="/registre">Registra't</Link></p>
      </div>
    </div>
  )
}

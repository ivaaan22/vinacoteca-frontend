import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Auth.css'

export default function Registre() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFoto = e => {
    const file = e.target.files[0]
    if (!file) return
    // Validació de mida (2 MB màxim al backend)
    if (file.size > 2 * 1024 * 1024) {
      setError('La foto ha de pesar menys de 2 MB.')
      e.target.value = ''
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Només es permeten imatges.')
      e.target.value = ''
      return
    }
    setError(null)
    setFoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)

    const email = form.email.trim().toLowerCase()
    const password = form.password

    if (!email || !password) {
      return setError('Omple tots els camps.')
    }
    if (password.length < 6) {
      return setError('La contrasenya ha de tenir almenys 6 caràcters.')
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      if (foto) formData.append('foto', foto)

      const { data } = await api.post('/api/auth/registro', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const usuariRebut = data.usuari ?? data.user ?? data.usuario ?? null
      const tokenRebut = data.token ?? data.accessToken ?? null

      if (!tokenRebut || !usuariRebut) {
        setError('Resposta del servidor incorrecta.')
        return
      }

      login(tokenRebut, usuariRebut)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.error
        || err.response?.data?.message
        || (err.code === 'ERR_NETWORK' ? 'No es pot connectar amb el servidor.' : 'Error en registrar-se')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🍷</div>
        <h1>Crear compte</h1>
        <p className="auth-sub">Uneix-te a la Vinacoteca</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email
            <input type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="correu@exemple.cat"
              autoComplete="email" />
          </label>
          <label>Contrasenya
            <input type="password" name="password" value={form.password}
              onChange={handleChange} required minLength={6} placeholder="Mínim 6 caràcters"
              autoComplete="new-password" />
          </label>
          <label>Foto de perfil (opcional)
            <input type="file" accept="image/*" onChange={handleFoto} />
          </label>
          {preview && (
            <div className="auth-preview">
              <img src={preview} alt="Previsualització" />
            </div>
          )}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Registrant...' : 'Crear compte'}
          </button>
        </form>
        <p className="auth-link">Ja tens compte? <Link to="/login">Inicia sessió</Link></p>
      </div>
    </div>
  )
}

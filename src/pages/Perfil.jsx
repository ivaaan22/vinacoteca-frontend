import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api, { API_URL } from '../api/axios'
import './Perfil.css'

export default function Perfil() {
  const { usuari, login, token } = useAuth()
  const [dades, setDades] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editant, setEditant] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [novaFoto, setNovaFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [missatge, setMissatge] = useState(null)
  const [desant, setDesant] = useState(false)

  useEffect(() => {
    api.get('/api/auth/perfil')
      .then(r => {
        const u = r.data.usuari ?? r.data.user ?? r.data ?? null
        if (u) {
          setDades(u)
          setForm({ email: u.email ?? '', password: '' })
        } else if (usuari) {
          setDades(usuari)
          setForm({ email: usuari.email ?? '', password: '' })
        }
      })
      .catch(() => {
        // Fallback al context si el backend falla
        if (usuari) {
          setDades(usuari)
          setForm({ email: usuari.email ?? '', password: '' })
        } else {
          setMissatge({ tipus: 'error', text: 'Error carregant el perfil.' })
        }
      })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFoto = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setMissatge({ tipus: 'error', text: 'La foto ha de pesar menys de 2 MB.' })
      e.target.value = ''
      return
    }
    if (!file.type.startsWith('image/')) {
      setMissatge({ tipus: 'error', text: 'Només es permeten imatges.' })
      e.target.value = ''
      return
    }
    setMissatge(null)
    setNovaFoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMissatge(null)
    setDesant(true)
    try {
      const formData = new FormData()
      if (form.email) formData.append('email', form.email.trim().toLowerCase())
      if (form.password) formData.append('password', form.password)
      if (novaFoto) formData.append('foto', novaFoto)

      const { data } = await api.put('/api/auth/perfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const usuariActualitzat = data.usuari ?? data.user ?? data
      const nouToken = data.token ?? token

      login(nouToken, usuariActualitzat)
      setDades(usuariActualitzat)
      setEditant(false)
      setNovaFoto(null)
      setPreview(null)
      setForm({ email: usuariActualitzat.email, password: '' })
      setMissatge({ tipus: 'ok', text: 'Perfil actualitzat correctament.' })
    } catch (err) {
      setMissatge({
        tipus: 'error',
        text: err.response?.data?.error || 'Error desant el perfil.'
      })
    } finally {
      setDesant(false)
    }
  }

  const cancellar = () => {
    setEditant(false)
    setNovaFoto(null)
    setPreview(null)
    setForm({ email: dades?.email ?? '', password: '' })
    setMissatge(null)
  }

  if (loading) return <div className="perfil-loading">Carregant perfil...</div>
  if (!dades) return <div className="perfil-loading">No s'han pogut carregar les dades.</div>

  // Construeix URL absoluta de la foto, evitant dobles barres
  const fotoSrc = preview ?? (
    dades?.foto
      ? (dades.foto.startsWith('http')
          ? dades.foto
          : `${API_URL}/${dades.foto.replace(/^\/+/, '')}`)
      : null
  )

  const rolLabel = { admin: '👑 Admin', editor: '✏️ Editor', usuari: '👤 Usuari' }

  return (
    <div className="perfil-page">
      <div className="perfil-card">
        <div className="perfil-avatar-wrap">
          {fotoSrc
            ? <img src={fotoSrc} alt="Foto de perfil" className="perfil-avatar"
                onError={(e) => { e.target.style.display = 'none' }} />
            : <div className="perfil-avatar-placeholder">🍷</div>
          }
          <span className={`perfil-rol perfil-rol--${dades?.rol}`}>
            {rolLabel[dades?.rol] ?? dades?.rol}
          </span>
        </div>

        <div className="perfil-info">
          <h1>El meu perfil</h1>
          <p className="perfil-email">{dades?.email}</p>

          {missatge && (
            <div className={`perfil-missatge perfil-missatge--${missatge.tipus}`}>
              {missatge.text}
            </div>
          )}

          {!editant ? (
            <button className="perfil-btn-edit" onClick={() => { setMissatge(null); setEditant(true) }}>
              ✏️ Editar perfil
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="perfil-form">
              <label>Email
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>
              <label>Nova contrasenya <span className="perfil-opcional">(opcional)</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  minLength={6}
                  placeholder="Deixa buit per no canviar"
                  autoComplete="new-password"
                />
              </label>
              <label>Nova foto de perfil <span className="perfil-opcional">(opcional)</span>
                <input type="file" accept="image/*" onChange={handleFoto} />
              </label>
              {preview && (
                <div className="perfil-preview">
                  <img src={preview} alt="Nova foto" />
                </div>
              )}
              <div className="perfil-form-btns">
                <button type="submit" className="perfil-btn-save" disabled={desant}>
                  {desant ? 'Desant...' : 'Guardar canvis'}
                </button>
                <button type="button" className="perfil-btn-cancel" onClick={cancellar}>
                  Cancel·lar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

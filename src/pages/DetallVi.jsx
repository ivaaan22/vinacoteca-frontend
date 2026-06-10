import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Detall.css'

export default function DetallVi() {
  const { id } = useParams()
  const { usuari } = useAuth()
  const navigate = useNavigate()
  const [vi, setVi] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [missatge, setMissatge] = useState(null)
  const [commandant, setCommandant] = useState(false)

  useEffect(() => {
    api.get(`/api/vinos/${id}`)
      .then(r => setVi(r.data))
      .catch(e => setError(
        e.response?.status === 404
          ? 'Vi no trobat.'
          : 'Error carregant el vi.'
      ))
      .finally(() => setLoading(false))
  }, [id])

  const afegirComanda = async () => {
    if (!usuari) return navigate('/login')
    setCommandant(true)
    setMissatge(null)
    try {
      await api.post('/api/comandes', {
        linies: [{ tipusProducte: 'Vino', producte: id, quantitat: 1 }]
      })
      setMissatge({ tipus: 'ok', text: '✅ Comanda creada correctament!' })
    } catch (err) {
      setMissatge({
        tipus: 'error',
        text: err.response?.data?.error || '❌ Error creant la comanda.'
      })
    } finally {
      setCommandant(false)
    }
  }

  if (loading) return <div className="detall-loading">Carregant...</div>
  if (error) return <div className="detall-error">{error}</div>
  if (!vi) return null

  return (
    <div className="detall">
      <button onClick={() => navigate(-1)} className="detall-back">← Tornar</button>
      <div className="detall-card">
        {vi.imatge ? (
          <img
            src={vi.imatge}
            alt={vi.nom}
            className="detall-img"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="detall-icon" style={{ display: vi.imatge ? 'none' : 'flex' }}>🍷</div>
        <div className="detall-content">
          <span className="detall-tipus">{vi.tipus}</span>
          <h1>{vi.nom}</h1>
          <p className="detall-grad">Graduació: <strong>{vi.graduacio}°</strong></p>
          {vi.preu != null && (
            <p className="detall-preu">{Number(vi.preu).toFixed(2)} €</p>
          )}
          {vi.descripcio && <p className="detall-desc">{vi.descripcio}</p>}
          {missatge && (
            <p className={`detall-missatge detall-missatge--${missatge.tipus}`}>
              {missatge.text}
            </p>
          )}
          <button
            onClick={afegirComanda}
            className="detall-btn"
            disabled={commandant || missatge?.tipus === 'ok'}
          >
            {!usuari
              ? 'Inicia sessió per fer comanda'
              : commandant
              ? 'Processant...'
              : missatge?.tipus === 'ok'
              ? 'Comanda feta ✓'
              : 'Fer comanda'}
          </button>
        </div>
      </div>
    </div>
  )
}

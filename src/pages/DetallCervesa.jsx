import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Detall.css'

export default function DetallCervesa() {
  const { id } = useParams()
  const { usuari } = useAuth()
  const navigate = useNavigate()
  const [cervesa, setCervesa] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [missatge, setMissatge] = useState(null)
  const [commandant, setCommandant] = useState(false)

  useEffect(() => {
    api.get(`/api/cervezas/${id}`)
      .then(r => setCervesa(r.data))
      .catch(e => setError(e.response?.status === 404 ? 'Cervesa no trobada.' : 'Error carregant la cervesa.'))
      .finally(() => setLoading(false))
  }, [id])

  const afegirComanda = async () => {
    if (!usuari) return navigate('/login')
    setCommandant(true)
    try {
      await api.post('/api/comandes', {
        linies: [{ tipusProducte: 'Cerveza', producte: id, quantitat: 1 }]
      })
      setMissatge({ tipus: 'ok', text: '✅ Comanda creada correctament!' })
    } catch {
      setMissatge({ tipus: 'error', text: '❌ Error creant la comanda.' })
    } finally {
      setCommandant(false)
    }
  }

  if (loading) return <div className="detall-loading">Carregant...</div>
  if (error) return <div className="detall-error">{error}</div>
  if (!cervesa) return null

  return (
    <div className="detall">
      <button onClick={() => navigate(-1)} className="detall-back">← Tornar</button>
      <div className="detall-card">
        {cervesa.imatge ? (
          <img
            src={cervesa.imatge}
            alt={cervesa.nom}
            className="detall-img"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="detall-icon" style={{ display: cervesa.imatge ? 'none' : 'flex' }}>🍺</div>
        <div className="detall-content">
          <span className="detall-tipus">{cervesa.tipus}</span>
          <h1>{cervesa.nom}</h1>
          <p className="detall-grad">Graduació: <strong>{cervesa.graduacio}°</strong></p>
          {cervesa.preu != null && (
            <p className="detall-preu">{cervesa.preu.toFixed(2)} €</p>
          )}
          {cervesa.descripcio && <p className="detall-desc">{cervesa.descripcio}</p>}
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

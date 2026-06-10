import { useEffect, useState } from 'react'
import api from '../api/axios'
import './Comandes.css'

const ESTAT_COLORS = {
  pendent: '#c9a84c',
  confirmada: '#4caf50',
  enviada: '#2196f3',
  entregada: '#8bc34a',
  'cancel·lada': '#f44336'
}

export default function Comandes() {
  const [comandes, setComandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/api/comandes/me')
      .then(r => {
        const llista = r.data?.comandes ?? r.data ?? []
        setComandes(Array.isArray(llista) ? llista : [])
      })
      .catch(() => setError('Error carregant les comandes.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="comandes-loading">Carregant comandes...</div>
  if (error) return <div className="comandes-error">{error}</div>

  return (
    <div className="comandes-page">
      <h1>Les meves comandes</h1>
      {comandes.length === 0 && (
        <p className="comandes-buit">Encara no has fet cap comanda.</p>
      )}
      <div className="comandes-llista">
        {comandes.map(c => (
          <div key={c._id} className="comanda-card">
            <div className="comanda-header">
              <span className="comanda-id">#{c._id.slice(-6).toUpperCase()}</span>
              <span className="comanda-estat" style={{ color: ESTAT_COLORS[c.estat] ?? '#e8d5b0' }}>
                {c.estat}
              </span>
              <span className="comanda-data">
                {new Date(c.createdAt).toLocaleDateString('ca-ES')}
              </span>
            </div>
            <div className="comanda-linies">
              {(c.linies ?? []).map((l, i) => {
                // El producte pot estar populat (objecte) o ser només l'id
                const nomProducte = (typeof l.producte === 'object' && l.producte?.nom)
                  ? l.producte.nom
                  : l.tipusProducte
                const tipus = (typeof l.producte === 'object' && l.producte?.tipus)
                  ? l.producte.tipus
                  : null
                return (
                  <div key={i} className="comanda-linia">
                    <span>
                      {l.tipusProducte === 'Vino' ? '🍷' : '🍺'}{' '}
                      <strong>{nomProducte}</strong>
                      {tipus && <span className="comanda-linia-tipus"> ({tipus})</span>}
                    </span>
                    <span>x{l.quantitat}</span>
                    {l.preuUnitari != null && (
                      <span>{Number(l.preuUnitari).toFixed(2)} €/u</span>
                    )}
                  </div>
                )
              })}
            </div>
            {c.total != null && (
              <div className="comanda-total">
                Total: <strong>{Number(c.total).toFixed(2)} €</strong>
              </div>
            )}
            {c.adreca && <div className="comanda-adreca">📍 {c.adreca}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

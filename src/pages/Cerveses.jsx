import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import './Cataleg.css'

export default function Cerveses() {
  const [cerveses, setCerveses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/api/cervezas')
      .then(r => {
        const llista = r.data?.dades ?? r.data?.data ?? r.data ?? []
        setCerveses(Array.isArray(llista) ? llista : [])
      })
      .catch(err => {
        const msg = err.code === 'ERR_NETWORK'
          ? 'No es pot connectar amb el servidor.'
          : 'Error carregant les cerveses.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="cataleg-loading">Carregant cerveses...</div>
  if (error) return <div className="cataleg-error">{error}</div>

  return (
    <div className="cataleg">
      <div className="cataleg-header">
        <h1>🍺 Cerveses</h1>
        <p>Artesanes i d'importació seleccionades</p>
      </div>
      <div className="cataleg-grid">
        {cerveses.length === 0 && <p className="cataleg-buit">No hi ha cerveses disponibles.</p>}
        {cerveses.map(c => (
          <Link to={`/cerveses/${c._id}`} key={c._id} className="producte-card">
            {c.imatge ? (
              <img
                src={c.imatge}
                alt={c.nom}
                className="producte-img"
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div className="producte-icon" style={{ display: c.imatge ? 'none' : 'flex' }}>🍺</div>
            <div className="producte-info">
              <h3>{c.nom}</h3>
              <div className="producte-meta">
                <span className="producte-tipus">{c.tipus}</span>
                <span className="producte-grad">{c.graduacio}°</span>
              </div>
              {c.preu != null && c.preu > 0 && (
                <span className="producte-preu">{Number(c.preu).toFixed(2)} €</span>
              )}
              {c.descripcio && <p className="producte-desc">{c.descripcio}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

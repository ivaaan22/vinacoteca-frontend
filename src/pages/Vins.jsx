import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import './Cataleg.css'

export default function Vins() {
  const [vins, setVins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/api/vinos')
      .then(r => {
        const llista = r.data?.dades ?? r.data?.data ?? r.data ?? []
        setVins(Array.isArray(llista) ? llista : [])
      })
      .catch(err => {
        const msg = err.code === 'ERR_NETWORK'
          ? 'No es pot connectar amb el servidor.'
          : 'Error carregant els vins.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="cataleg-loading">Carregant vins...</div>
  if (error) return <div className="cataleg-error">{error}</div>

  return (
    <div className="cataleg">
      <div className="cataleg-header">
        <h1>🍷 Vins</h1>
        <p>La nostra selecció de vins d'autor</p>
      </div>
      <div className="cataleg-grid">
        {vins.length === 0 && <p className="cataleg-buit">No hi ha vins disponibles.</p>}
        {vins.map(v => (
          <Link to={`/vins/${v._id}`} key={v._id} className="producte-card">
            {v.imatge ? (
              <img
                src={v.imatge}
                alt={v.nom}
                className="producte-img"
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div className="producte-icon" style={{ display: v.imatge ? 'none' : 'flex' }}>🍷</div>
            <div className="producte-info">
              <h3>{v.nom}</h3>
              <div className="producte-meta">
                <span className="producte-tipus">{v.tipus}</span>
                <span className="producte-grad">{v.graduacio}°</span>
              </div>
              {v.preu != null && v.preu > 0 && (
                <span className="producte-preu">{Number(v.preu).toFixed(2)} €</span>
              )}
              {v.descripcio && <p className="producte-desc">{v.descripcio}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

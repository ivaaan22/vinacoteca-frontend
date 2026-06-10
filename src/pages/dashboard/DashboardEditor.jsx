import { useEffect, useState } from 'react'
import api from '../../api/axios'
import './Dashboard.css'

const BUIT = { nom: '', descripcio: '', graduacio: '', tipus: '', preu: '', imatge: '' }

export default function DashboardEditor() {
  const [vins, setVins] = useState([])
  const [cerveses, setCerveses] = useState([])
  const [tab, setTab] = useState('vins')
  const [form, setForm] = useState(BUIT)
  const [editant, setEditant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [missatge, setMissatge] = useState(null)

  const productes = tab === 'vins' ? vins : cerveses
  const endpoint = tab === 'vins' ? '/api/vinos' : '/api/cervezas'

  const carregar = async () => {
    setLoading(true)
    try {
      const [rv, rc] = await Promise.all([
        api.get('/api/vinos'),
        api.get('/api/cervezas')
      ])
      setVins(rv.data.dades)
      setCerveses(rc.data.dades)
    } catch {
      setMissatge({ tipus: 'error', text: 'Error carregant productes.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setMissatge(null)
    try {
      if (editant) {
        await api.put(`${endpoint}/${editant}`, form)
        setMissatge({ tipus: 'ok', text: 'Producte actualitzat.' })
      } else {
        await api.post(endpoint, form)
        setMissatge({ tipus: 'ok', text: 'Producte creat.' })
      }
      setForm(BUIT)
      setEditant(null)
      carregar()
    } catch (err) {
      setMissatge({ tipus: 'error', text: err.response?.data?.error || 'Error desant.' })
    }
  }

  const handleEditar = p => {
    setMissatge(null)
    setEditant(p._id)
    setForm({
      nom: p.nom,
      descripcio: p.descripcio || '',
      graduacio: p.graduacio,
      tipus: p.tipus,
      preu: p.preu ?? '',
      imatge: p.imatge || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEliminar = async id => {
    if (!window.confirm('Segur que vols eliminar aquest producte?')) return
    try {
      await api.delete(`${endpoint}/${id}`)
      setMissatge({ tipus: 'ok', text: 'Producte eliminat.' })
      carregar()
    } catch {
      setMissatge({ tipus: 'error', text: 'Error eliminant.' })
    }
  }

  const cancellar = () => {
    setForm(BUIT)
    setEditant(null)
    setMissatge(null)
  }

  const canviarTab = (nouTab) => {
    setTab(nouTab)
    cancellar()
  }

  return (
    <div className="dashboard">
      <h1>Dashboard {tab === 'vins' ? '🍷' : '🍺'}</h1>

      <div className="dash-tabs">
        <button className={tab === 'vins' ? 'active' : ''} onClick={() => canviarTab('vins')}>Vins</button>
        <button className={tab === 'cerveses' ? 'active' : ''} onClick={() => canviarTab('cerveses')}>Cerveses</button>
      </div>

      {/* Formulari */}
      <div className="dash-form-card">
        <h2>{editant ? 'Editar producte' : 'Nou producte'}</h2>
        {missatge && (
          <div className={`dash-missatge ${missatge.tipus}`}>{missatge.text}</div>
        )}
        <form onSubmit={handleSubmit} className="dash-form">
          <label>Nom
            <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Nom del producte" />
          </label>
          <label>Descripció
            <input name="descripcio" value={form.descripcio} onChange={handleChange} placeholder="Descripció breu" />
          </label>
          <label>Graduació (%)
            <input name="graduacio" type="number" step="0.1" min="0" max="100" value={form.graduacio} onChange={handleChange} required placeholder="Ex: 12.5" />
          </label>
          <label>Tipus
            <input name="tipus" value={form.tipus} onChange={handleChange} required placeholder={tab === 'vins' ? 'Negre, Blanc, Rosat...' : 'Lager, IPA, Stout...'} />
          </label>
          <label>Preu (€)
            <input
              name="preu"
              type="number"
              step="0.01"
              min="0"
              value={form.preu}
              onChange={handleChange}
              placeholder="Ex: 12.95"
            />
          </label>
          <label>URL de la imatge
            <input
              name="imatge"
              type="url"
              value={form.imatge}
              onChange={handleChange}
              placeholder="https://exemple.com/foto.jpg"
            />
          </label>

          {/* Preview de la imatge */}
          {form.imatge && (
            <div className="dash-preview">
              <span className="dash-preview-label">Vista prèvia:</span>
              <img
                src={form.imatge}
                alt="Vista prèvia"
                onError={e => { e.target.style.display = 'none' }}
                onLoad={e => { e.target.style.display = 'block' }}
              />
            </div>
          )}

          <div className="dash-form-btns">
            <button type="submit" className="btn-primary">{editant ? 'Guardar canvis' : 'Crear'}</button>
            {editant && <button type="button" onClick={cancellar} className="btn-secondary">Cancel·lar</button>}
          </div>
        </form>
      </div>

      {/* Llista */}
      <div className="dash-llista">
        <h2>Productes ({productes.length})</h2>
        {loading && <p className="dash-loading">Carregant...</p>}
        {!loading && productes.length === 0 && <p className="dash-buit">No hi ha productes.</p>}
        {productes.map(p => (
          <div key={p._id} className="dash-item">
            {p.imatge && (
              <img
                src={p.imatge}
                alt={p.nom}
                className="dash-item-img"
                onError={e => { e.target.style.display = 'none' }}
              />
            )}
            <div className="dash-item-info">
              <strong>{p.nom}</strong>
              <span className="dash-badge">{p.tipus}</span>
              <span className="dash-grad">{p.graduacio}°</span>
              {p.preu != null && <span className="dash-preu">{Number(p.preu).toFixed(2)} €</span>}
              {p.descripcio && <span className="dash-desc">{p.descripcio}</span>}
            </div>
            <div className="dash-item-btns">
              <button onClick={() => handleEditar(p)} className="btn-edit">Editar</button>
              <button onClick={() => handleEliminar(p._id)} className="btn-delete">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

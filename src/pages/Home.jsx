import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">Benvingut a la</p>
          <h1 className="home-title">Vinacoteca</h1>
          <p className="home-subtitle">
            Selecció artesanal de vins i cerveses d'autor.<br />
            Descobreix el millor de la península.
          </p>
          <div className="home-ctas">
            <Link to="/vins" className="cta-primary">Explorar vins</Link>
            <Link to="/cerveses" className="cta-secondary">Explorar cerveses</Link>
          </div>
        </div>
      </div>

      <section className="home-categories">
        <Link to="/vins" className="category-card">
          <span className="category-icon">🍷</span>
          <h2>Vins</h2>
          <p>Negres, blancs, rosats i escumosos seleccionats de les millors denominacions.</p>
        </Link>
        <Link to="/cerveses" className="category-card">
          <span className="category-icon">🍺</span>
          <h2>Cerveses</h2>
          <p>Artesanes i d'importació. Lager, IPA, Stout i molt més.</p>
        </Link>
      </section>
    </div>
  )
}

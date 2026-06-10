import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RutaProtegida from './components/RutaProtegida'
import Navbar from './components/Navbar'

import Home from './pages/Home'
import Vins from './pages/Vins'
import Cerveses from './pages/Cerveses'
import DetallVi from './pages/DetallVi'
import DetallCervesa from './pages/DetallCervesa'
import Login from './pages/Login'
import Registre from './pages/Registre'
import Comandes from './pages/Comandes'
import DashboardEditor from './pages/dashboard/DashboardEditor'
import DashboardAdmin from './pages/dashboard/DashboardAdmin'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Públiques */}
          <Route path="/" element={<Home />} />
          <Route path="/vins" element={<Vins />} />
          <Route path="/vins/:id" element={<DetallVi />} />
          <Route path="/cerveses" element={<Cerveses />} />
          <Route path="/cerveses/:id" element={<DetallCervesa />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registre" element={<Registre />} />

          {/* Usuari autenticat */}
          <Route path="/comandes" element={
            <RutaProtegida>
              <Comandes />
            </RutaProtegida>
          } />
          <Route path="/perfil" element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          } />

          {/* Editor i admin: CRUD productes */}
          <Route path="/dashboard" element={
            <RutaProtegida rols={['editor', 'admin']}>
              <DashboardEditor />
            </RutaProtegida>
          } />

          {/* Només admin: gestió usuaris */}
          <Route path="/dashboard/usuaris" element={
            <RutaProtegida rols={['admin']}>
              <DashboardAdmin />
            </RutaProtegida>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

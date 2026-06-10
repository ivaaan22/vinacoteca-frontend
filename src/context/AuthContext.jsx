import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuari, setUsuari] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const t = localStorage.getItem('token')
      const uRaw = localStorage.getItem('usuari')
      if (t && uRaw && uRaw !== 'undefined' && uRaw !== 'null') {
        const u = JSON.parse(uRaw)
        if (u && u.email) {
          setToken(t)
          setUsuari(u)
        } else {
          // Dades corruptes: netegem
          localStorage.removeItem('token')
          localStorage.removeItem('usuari')
        }
      }
    } catch (err) {
      // JSON invàlid: netegem
      console.error('AuthContext: localStorage corrupte, netejant.', err)
      localStorage.removeItem('token')
      localStorage.removeItem('usuari')
    }
    setLoading(false)
  }, [])

  const login = (tokenRebut, dadesUsuari) => {
    if (!tokenRebut || !dadesUsuari) {
      console.error('AuthContext.login: token o usuari buit.', { tokenRebut, dadesUsuari })
      return
    }
    localStorage.setItem('token', tokenRebut)
    localStorage.setItem('usuari', JSON.stringify(dadesUsuari))
    setToken(tokenRebut)
    setUsuari(dadesUsuari)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuari')
    setToken(null)
    setUsuari(null)
  }

  return (
    <AuthContext.Provider value={{ usuari, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

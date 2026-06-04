import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('nsp_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const saveLogin = useCallback((token, userData) => {
    localStorage.setItem('nsp_token', token)
    localStorage.setItem('nsp_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('nsp_token')
    localStorage.removeItem('nsp_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, saveLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

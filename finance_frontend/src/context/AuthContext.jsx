import { useState } from 'react'
import { AuthContext } from './authStore'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token    = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const email    = localStorage.getItem('email')
    return token ? { token, username, email } : null
  })

  const loginUser = (userData) => {
    const normalizedUser = {
      token: userData.token,
      username: userData.userName || userData.username,
      email: userData.email,
    }

    localStorage.setItem('token', normalizedUser.token)
    localStorage.setItem('username', normalizedUser.username)
    if (normalizedUser.email) localStorage.setItem('email', normalizedUser.email)
    setUser(normalizedUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

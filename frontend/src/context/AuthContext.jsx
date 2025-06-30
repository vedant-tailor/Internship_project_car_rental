import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Explicitly ensure isAdmin is a boolean
        parsedUser.isAdmin = !!parsedUser.isAdmin
        setUser(parsedUser)
        setIsAuthenticated(true)
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (error) {
        console.error('Error parsing user data:', error)
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token, user } = response.data

      // Ensure isAdmin is boolean
      user.isAdmin = !!user.isAdmin

      // Store token and user in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser(user)
      setIsAuthenticated(true)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      const { token, user } = response.data

      // Ensure isAdmin is boolean
      user.isAdmin = !!user.isAdmin

      // Store token and user in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser(user)
      setIsAuthenticated(true)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Remove authorization header
    delete axios.defaults.headers.common['Authorization']

    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={ { 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      register, 
      logout 
    } }>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
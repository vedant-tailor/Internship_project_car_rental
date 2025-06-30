import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const hasAllowedRole = allowedRoles.includes(user?.role || (user?.isAdmin ? 'admin' : 'user'))

  if (!hasAllowedRole) {
    return <Navigate to="/cars" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
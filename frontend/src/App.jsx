import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Context Imports
import { AuthProvider } from './context/AuthContext'

// Page Imports
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CarList from './pages/CarList'
import CarDetails from './pages/CarDetails'
import Bookings from './pages/Bookings'
import AdminDashboard from './pages/AdminDashboard'
import AddCarListing from './pages/AddCarListing'

// Component Imports
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/cars" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cars" element={<CarList />} />
          <Route path="cars/:id" element={<CarDetails />} />
          
          <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="add-car-listing" element={<AddCarListing />} /> 
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
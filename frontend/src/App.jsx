import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Context Imports
import { AuthProvider } from './context/AuthContext'

// Page Imports
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CarList from './pages/CarList'
import CarDetails from './pages/CarDetails'
import Bookings from './pages/Bookings'
import AdminDashboard from './pages/AdminDashboard'
import AddCarListing from './pages/AddCarListing'
import AdminBookings from './pages/AdminBookings'
// --- NEW IMPORTS ---
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'

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
          <Route path="about" element={<About />} />
          
          <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            {/* --- NEW PAYMENT ROUTES --- */}
            <Route path="payment" element={<Payment />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-cancel" element={<PaymentCancel />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/bookings" element={<AdminBookings />} />
            <Route path="add-car-listing" element={<AddCarListing />} /> 
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

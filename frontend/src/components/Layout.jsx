import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-4 text-center">
        <p className="text-gray-600">© 2024 Car Rental App. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Layout
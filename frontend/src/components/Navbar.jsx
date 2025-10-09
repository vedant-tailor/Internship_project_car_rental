import React from 'react'
import { Link } from 'react-router-dom'
import { FaCar, FaUser, FaSignOutAlt } from 'react-icons/fa'

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center text-primary-600 font-bold">
          <FaCar className="mr-2" />
          Car Rental
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/cars" className="text-gray-700 hover:text-primary-600">Cars</Link>
           <Link to="/about" className="text-gray-700 hover:text-primary-600">About</Link>
          {user && (
            <>
              {user.isAdmin ? (
                <Link to="/admin" className="text-gray-700 hover:text-primary-600">Admin Dashboard</Link>
              ) : (
                <Link to="/bookings" className="text-gray-700 hover:text-primary-600">My Bookings</Link>
              )}
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-600" />
                <button 
                  onClick={onLogout} 
                  className="text-red-500 hover:text-red-600 ml-2"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            </>
          )}
          {!user && (
            <div className="space-x-2">
              <Link to="/login" className="btn-primary px-3 py-1 rounded">Login</Link>
              <Link to="/register" className="btn-primary px-3 py-1 rounded">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
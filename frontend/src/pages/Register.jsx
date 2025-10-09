import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    drivingLicense: ''
  })
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await register(formData)
      toast.success('Registration successful!')
      navigate('/cars')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-primary-600">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="input-field pl-10"
              required
            />
          </div>
          <div className="relative">
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10"
              required
            />
          </div>
          <div className="relative">
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field pl-10"
              required
              minLength="6"
            />
          </div>
          <div className="relative">
            
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="input-field pl-10"
              required
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="address"
              placeholder="Address (Optional)"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="drivingLicense"
              placeholder="Driving License (Optional)"
              value={formData.drivingLicense}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary w-full py-2 rounded">
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account? {' '}
            <Link to="/login" className="text-primary-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
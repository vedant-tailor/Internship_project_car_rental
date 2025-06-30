import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaSpinner, FaCar, FaUser, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats')
        setStats(response.data.stats)
        setIsLoading(false)
      } catch (error) {
        toast.error('Failed to fetch admin stats')
        setIsLoading(false)
      }
    }

    fetchAdminStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-primary-600 text-4xl" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FaCar />} 
          title="Total Cars" 
          value={stats.totalCars} 
          color="text-blue-600" 
        />
        <StatCard 
          icon={<FaCar />} 
          title="Available Cars" 
          value={stats.availableCars} 
          color="text-green-600" 
        />
        <StatCard 
          icon={<FaUser />} 
          title="Total Users" 
          value={stats.totalUsers} 
          color="text-purple-600" 
        />
        <StatCard 
          icon={<FaClipboardList />} 
          title="Total Bookings" 
          value={stats.totalBookings} 
          color="text-yellow-600" 
        />
        <StatCard 
          icon={<FaClipboardList />} 
          title="Active Bookings" 
          value={stats.activeBookings} 
          color="text-orange-600" 
        />
        <StatCard 
          icon={<FaMoneyBillWave />} 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          color="text-green-700" 
        />
      </div>
    </div>
  )
}

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
    <div className={`mr-4 text-3xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
)

export default AdminDashboard
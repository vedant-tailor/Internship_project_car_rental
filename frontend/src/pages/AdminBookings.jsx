import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { FaSpinner } from 'react-icons/fa'

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800'
    case 'Confirmed': return 'bg-green-100 text-green-800'
    case 'Active': return 'bg-blue-100 text-blue-800'
    case 'Completed': return 'bg-gray-100 text-gray-800'
    case 'Cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get('/api/admin/bookings')
      setBookings(response.data.bookings)
    } catch (error) {
      toast.error('Failed to fetch bookings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllBookings()
  }, [])

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const response = await axios.put(`/api/admin/bookings/${bookingId}`, { status })
      setBookings(prevBookings =>
        prevBookings.map(b => (b._id === bookingId ? response.data.booking : b))
      )
      toast.success(`Booking status updated to ${status}`)
    } catch (error) {
      toast.error('Failed to update booking status')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-primary-600 text-4xl" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">All Bookings</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          {/* --- MODIFIED CODE BLOCK START --- */}
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.car?.name ?? 'Deleted Car'}</div>
                  <div className="text-sm text-gray-500">{booking.car?.brand} {booking.car?.model}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.user?.name ?? 'Deleted User'}</div>
                  <div className="text-sm text-gray-500">{booking.user?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {booking.status === 'Pending' && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Accept
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          {/* --- MODIFIED CODE BLOCK END --- */}
        </table>
        {bookings.length === 0 && <p className="text-center p-4">No bookings found.</p>}
      </div>
    </div>
  )
}

export default AdminBookings
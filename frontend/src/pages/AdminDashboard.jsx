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

// Define the possible statuses for the dropdown
const bookingStatuses = ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'];

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

  // Handler for the new dropdown
  const handleStatusChange = (bookingId, newStatus) => {
    if (newStatus) {
      handleUpdateStatus(bookingId, newStatus);
    }
  };

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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{booking.totalAmount.toFixed(2)}</td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>

                {/* --- MODIFIED ACTIONS CELL --- */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select 
                    value={booking.status} 
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className="input-field py-1 px-2 text-xs w-full max-w-xs"
                    // Disable dropdown if booking is already Completed or Cancelled
                    disabled={booking.status === 'Completed' || booking.status === 'Cancelled'}
                  >
                    {bookingStatuses.map(status => {
                      // --- NEW LOGIC ---
                      // Hide 'Completed' option if payment is not 'Paid' AND status is not already 'Completed'
                      if (
                        status === 'Active' && 
                        booking.paymentStatus !== 'Paid' &&
                        booking.status !== 'Completed'
                      ){
                        return null;
                      }
                      if (
                        status === 'Completed' &&
                        booking.paymentStatus !== 'Paid' &&
                        booking.status !== 'Completed'
                      ) {
                        return null; // Don't render the 'Completed' option
                      }
                      
                      return (
                        <option 
                          key={status} 
                          value={status}
                        >
                          {status}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-center p-4">No bookings found.</p>}
      </div>
    </div>
  )
}

export default AdminBookings


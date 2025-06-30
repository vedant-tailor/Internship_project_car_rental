import React from 'react'
import { format } from 'date-fns'
import { FaCar, FaCalendar, FaClock, FaMoneyBillWave } from 'react-icons/fa'
import { carService } from '../services/carService'
import toast from 'react-hot-toast'

const BookingCard = ({ booking, onCancel }) => {
  const handleCancelBooking = async () => {
    try {
      const confirmCancel = window.confirm('Are you sure you want to cancel this booking?')
      if (confirmCancel) {
        await carService.cancelBooking(booking._id)
        toast.success('Booking cancelled successfully')
        onCancel(booking._id)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600'
      case 'Confirmed': return 'text-green-600'
      case 'Active': return 'text-blue-600'
      case 'Completed': return 'text-gray-600'
      case 'Cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FaCar className="mr-2 text-primary-600" />
          <h3 className="text-xl font-bold">{booking.car.name}</h3>
        </div>
        <span className={`font-semibold ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <FaCalendar className="mr-2 text-gray-600" />
          <span>
            {format(new Date(booking.startDate), 'MMM dd, yyyy')} - 
            {format(new Date(booking.endDate), 'MMM dd, yyyy')}
          </span>
        </div>
        <div className="flex items-center">
          <FaClock className="mr-2 text-gray-600" />
          <span>{booking.totalDays} days</span>
        </div>
        <div className="flex items-center">
          <FaMoneyBillWave className="mr-2 text-gray-600" />
          <span>${booking.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
        <button 
          onClick={handleCancelBooking}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Cancel Booking
        </button>
      )}
    </div>
  )
}

export default BookingCard
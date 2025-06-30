import React, { useState, useEffect } from 'react'
import { carService } from '../services/carService'
import BookingCard from '../components/BookingCard'
import { FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userBookings = await carService.getUserBookings()
        setBookings(userBookings)
        setIsLoading(false)
      } catch (error) {
        toast.error('Failed to fetch bookings')
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleCancelBooking = (cancelledBookingId) => {
    setBookings(prevBookings => 
      prevBookings.filter(booking => booking._id !== cancelledBookingId)
    )
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
      <h1 className="text-3xl font-bold mb-6 text-primary-600">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>You have no bookings yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map(booking => (
            <BookingCard 
              key={booking._id} 
              booking={booking} 
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Bookings
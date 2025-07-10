import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { carService } from '../services/carService'
import { useAuth } from '../context/AuthContext'
import { FaSpinner, FaArrowLeft } from 'react-icons/fa'
import toast from 'react-hot-toast'

const CarDetails = () => {
  const [imageError, setImageError] = useState(false)

  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    // If no image path or error occurred, use default image
    if (!imagePath || imageError) {
      return '/default-car.png'
    }

    // Construct full URL for server-uploaded images
    // Assumes backend server is running on localhost:4000 and uses '/uploads' path
    return `http://localhost:4000/${imagePath.replace(/\\/g, '/')}`
  }

  const handleImageError = () => {
    setImageError(true)
  }
  const [car, setCar] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: ''
  })

  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const carDetails = await carService.getCarById(id)
        setCar(carDetails)
        setIsLoading(false)
      } catch (error) {
        toast.error('Failed to fetch car details')
        setIsLoading(false)
      }
    }

    fetchCarDetails()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBookCar = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please login to book a car')
      navigate('/login')
      return
    }

    try {
      const bookingData = {
        ...bookingDetails,
        carId: car._id
      }
      await carService.createBooking(bookingData)
      toast.success('Car booked successfully!')
      navigate('/bookings')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-primary-600 text-4xl" />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="text-center text-gray-600 mt-10">
        <p>Car not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button 
        onClick={() => navigate('/cars')} 
        className="flex items-center text-primary-600 mb-4 hover:text-primary-700"
      >
        <FaArrowLeft className="mr-2" /> Back to Cars
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
        <img
          src={getImageUrl(car.images[0])}
          alt={car.name}
          onError={handleImageError}
            className="w-full rounded-lg shadow-md"
          />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {car.images.slice(1).map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`${car.name} - ${index + 2}`} 
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-primary-600 mb-4">{car.name}</h1>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">Brand</p>
                <p className="font-semibold">{car.brand}</p>
              </div>
              <div>
                <p className="text-gray-600">Model</p>
                <p className="font-semibold">{car.model}</p>
              </div>
              <div>
                <p className="text-gray-600">Year</p>
                <p className="font-semibold">{car.year}</p>
              </div>
              <div>
                <p className="text-gray-600">Price</p>
                <p className="font-semibold">${car.pricePerDay}/day</p>
              </div>
            </div>

            <form onSubmit={handleBookCar} className="space-y-4">
              <div>
                <label className="block mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={bookingDetails.startDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={bookingDetails.endDate}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Pickup Location</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={bookingDetails.pickupLocation}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Dropoff Location</label>
                <input
                  type="text"
                  name="dropoffLocation"
                  value={bookingDetails.dropoffLocation}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary w-full py-2 rounded"
                disabled={!car.isAvailable}
              >
                {car.isAvailable ? 'Book Now' : 'Not Available'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCar, FaGasPump, FaCogs, FaUsers } from 'react-icons/fa'

const CarCard = ({ car }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <img
          src={getImageUrl(car.images[0])}
          alt={car.name}
          onError={handleImageError}
          className="w-full h-48 object-cover"
        />
        {!car.isAvailable && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
            Unavailable
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-primary-600 mb-2">{car.name}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">{car.brand} • {car.model}</span>
          <span className="text-primary-600 font-bold">${car.pricePerDay}/day</span>
        </div>
        <div className="flex space-x-3 text-gray-600 mb-4">
          <div className="flex items-center">
            <FaCar className="mr-1" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center">
            <FaGasPump className="mr-1" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center">
            <FaCogs className="mr-1" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <FaUsers className="mr-1" />
            <span>{car.seats} seats</span>
          </div>
        </div>
        <Link 
          to={`/cars/${car._id}`} 
          className="btn-primary w-full text-center py-2 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default CarCard
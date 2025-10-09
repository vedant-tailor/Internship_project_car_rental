import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaGasPump, FaCogs, FaUsers } from 'react-icons/fa';

const CarCard = ({ car }) => {
  const [imageError, setImageError] = useState(false);

  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    // If no image path or error occurred, use default image
    if (!imagePath || imageError) {
      return 'https://placehold.co/600x400/0284c7/white?text=Car';
    }

    // Construct full URL for server-uploaded images
    // Assumes backend server is running on localhost:4000 and uses '/uploads' path
    return `http://localhost:4000/${imagePath.replace(/\\/g, '/')}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

 return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl flex flex-col h-full">
      <div className="relative">
        <img
          src={getImageUrl(car.images[0])}
          alt={car.name}
          onError={handleImageError}
          className="w-full h-48 object-cover"
        />
        {!car.isAvailable && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Unavailable
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-primary-600 mb-1 truncate">{car.name}</h3>
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600 text-sm">{car.brand} • {car.model}</span>
          <span className="text-primary-600 font-bold text-lg">₹{car.pricePerDay}/day</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600 mb-4 text-sm">
          <div className="flex items-center">
            <FaCar className="mr-2 text-primary-500" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center">
            <FaGasPump className="mr-2 text-primary-500" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center">
            <FaCogs className="mr-2 text-primary-500" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <FaUsers className="mr-2 text-primary-500" />
            <span>{car.seats} seats</span>
          </div>
        </div>
        <div className="mt-auto pt-2">
            <Link 
              to={`/cars/${car._id}`} 
              className="block w-full text-center py-2 px-4 rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              View Details
            </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
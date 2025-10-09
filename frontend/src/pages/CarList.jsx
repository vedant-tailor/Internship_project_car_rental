import React, { useState, useEffect } from 'react'
import { carService } from '../services/carService'
import CarCard from '../components/CarCard'
import FilterSidebar from '../components/FilterSidebar'
import { FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'

const CarList = () => {
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true)
        const carList = await carService.getAllCars(filters)
        setCars(carList)
        setIsLoading(false)
      } catch (error) {
        toast.error('Failed to fetch cars')
        setIsLoading(false)
      }
    }

    fetchCars()
  }, [filters])

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <>
      {/* --- HERO SECTION START --- */}
      <div className="relative bg-gray-800 text-white py-20 px-4 sm:px-6 lg:px-8 rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"
            alt="Sports car background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-transparent"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Find Your Perfect Ride
          </h1>
          <p className="mt-6 text-xl text-primary-100">
            High-quality cars for rent at unbeatable prices. Your journey starts here.
          </p>
        </div>
      </div>
      {/* --- HERO SECTION END --- */}

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold mb-8 text-primary-600 border-b-2 border-primary-200 pb-2">
          Our Fleet
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <FaSpinner className="animate-spin text-primary-600 text-4xl" />
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            <h3 className="text-2xl font-semibold mb-2">No Cars Found</h3>
            <p>Try adjusting your search filters to find the perfect car.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {cars.map(car => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
        <FilterSidebar onApplyFilters={handleApplyFilters} />
      </div>
    </>
  );
};

export default CarList;
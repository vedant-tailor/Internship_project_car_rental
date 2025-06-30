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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-primary-600 text-4xl" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-primary-600">Available Cars</h1>
      {cars.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No cars found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
      <FilterSidebar onApplyFilters={handleApplyFilters} />
    </div>
  )
}

export default CarList
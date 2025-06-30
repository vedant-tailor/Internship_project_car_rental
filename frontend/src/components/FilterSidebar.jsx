import React, { useState } from 'react'
import { FaFilter, FaTimes } from 'react-icons/fa'

const FilterSidebar = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    brand: '',
    fuelType: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
    available: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== false)
    )
    onApplyFilters(activeFilters)
    setIsOpen(false)
  }

  const resetFilters = () => {
    setFilters({
      brand: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      available: false
    })
    onApplyFilters({})
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-primary-700"
      >
        <FaFilter />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-80 p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-600">Filters</h2>
              <button onClick={() => setIsOpen(false)}>
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Brand</label>
                <input 
                  type="text" 
                  name="brand" 
                  value={filters.brand}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter brand"
                />
              </div>
              <div>
                <label className="block mb-2">Fuel Type</label>
                <select 
                  name="fuelType" 
                  value={filters.fuelType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">All Fuel Types</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Transmission</label>
                <select 
                  name="transmission" 
                  value={filters.transmission}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">All Transmissions</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Min Price</label>
                  <input 
                    type="number" 
                    name="minPrice" 
                    value={filters.minPrice}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className="block mb-2">Max Price</label>
                  <input 
                    type="number" 
                    name="maxPrice" 
                    value={filters.maxPrice}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  name="available" 
                  checked={filters.available}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label>Only Available Cars</label>
              </div>
              <div className="flex space-x-4">
                <button 
                  type="submit" 
                  className="btn-primary flex-1 py-2"
                >
                  Apply Filters
                </button>
                <button 
                  type="button" 
                  onClick={resetFilters}
                  className="bg-gray-200 text-gray-800 flex-1 py-2 rounded"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default FilterSidebar
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FaCar, FaPlus } from 'react-icons/fa'

const AddCarListing = () => {
  const [images, setImages] = useState([])
  const navigate = useNavigate()
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm()

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const validImageFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    )

    if (validImageFiles.length + images.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    setImages(prevImages => [...prevImages, ...validImageFiles])
  }

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    const formData = new FormData()
    
    // Append text fields
    Object.keys(data).forEach(key => {
      if (key !== 'images') {
        formData.append(key, data[key])
      }
    })

    // Append images
    images.forEach(image => {
      formData.append('images', image)
    })

    try {
      await axios.post('/api/admin/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      toast.success('Car added successfully!')
      reset()
      setImages([])
      navigate('/cars')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add car')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary-600 flex items-center">
          <FaCar className="mr-3" /> Add New Car Listing
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Car Name</label>
              <input
                type="text"
                className="input-field"
                {...register('name', { 
                  required: 'Car name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block mb-2">Brand</label>
              <input
                type="text"
                className="input-field"
                {...register('brand', { 
                  required: 'Brand is required',
                  minLength: { value: 2, message: 'Brand must be at least 2 characters' }
                })}
              />
              {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Model</label>
              <input
                type="text"
                className="input-field"
                {...register('model', { 
                  required: 'Model is required',
                  minLength: { value: 1, message: 'Model must be specified' }
                })}
              />
              {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
            </div>

            <div>
              <label className="block mb-2">Year</label>
              <input
                type="number"
                className="input-field"
                {...register('year', { 
                  required: 'Year is required',
                  min: { value: 1990, message: 'Year must be 1990 or later' },
                  max: { value: new Date().getFullYear() + 1, message: 'Invalid year' }
                })}
              />
              {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Color</label>
              <input
                type="text"
                className="input-field"
                {...register('color', { 
                  required: 'Color is required',
                  minLength: { value: 2, message: 'Color must be at least 2 characters' }
                })}
              />
              {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
            </div>

            <div>
              <label className="block mb-2">Fuel Type</label>
              <select
                className="input-field"
                {...register('fuelType', { required: 'Fuel type is required' })}
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              {errors.fuelType && <p className="text-red-500 text-sm">{errors.fuelType.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Transmission</label>
              <select
                className="input-field"
                {...register('transmission', { required: 'Transmission is required' })}
              >
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
              {errors.transmission && <p className="text-red-500 text-sm">{errors.transmission.message}</p>}
            </div>

            <div>
              <label className="block mb-2">Seats</label>
              <input
                type="number"
                className="input-field"
                {...register('seats', { 
                  required: 'Number of seats is required',
                  min: { value: 2, message: 'Minimum 2 seats' },
                  max: { value: 8, message: 'Maximum 8 seats' }
                })}
              />
              {errors.seats && <p className="text-red-500 text-sm">{errors.seats.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Price Per Day</label>
              <input
                type="number"
                className="input-field"
                {...register('pricePerDay', { 
                  required: 'Price is required',
                  min: { value: 10, message: 'Minimum price is $10' }
                })}
              />
              {errors.pricePerDay && <p className="text-red-500 text-sm">{errors.pricePerDay.message}</p>}
            </div>

            <div>
              <label className="block mb-2">Location</label>
              <input
                type="text"
                className="input-field"
                {...register('location', { 
                  required: 'Location is required',
                  minLength: { value: 2, message: 'Location must be at least 2 characters' }
                })}
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-2">Registration Number</label>
            <input
              type="text"
              className="input-field"
              {...register('registrationNumber', { 
                required: 'Registration number is required',
                minLength: { value: 4, message: 'Registration number must be at least 4 characters' }
              })}
            />
            {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber.message}</p>}
          </div>

          <div>
            <label className="block mb-2">Description (Optional)</label>
            <textarea
              className="input-field"
              rows="4"
              {...register('description')}
            />
          </div>

          <div>
            <label className="block mb-2">Car Images (Max 5)</label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="imageUpload"
                onChange={handleImageUpload}
              />
              <label 
                htmlFor="imageUpload" 
                className="btn-primary flex items-center px-4 py-2 rounded cursor-pointer"
              >
                <FaPlus className="mr-2" /> Upload Images
              </label>
              <span className="text-gray-600">{images.length} / 5 images</span>
            </div>
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Car ${index + 1}`} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full py-3 rounded mt-4 flex items-center justify-center"
          >
            <FaCar className="mr-2" /> Add Car Listing
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddCarListing
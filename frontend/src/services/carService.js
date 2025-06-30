import axios from 'axios'

export const carService = {
  async getAllCars(filters = {}) {
    try {
      const response = await axios.get('/api/cars', { params: filters })
      return response.data.cars
    } catch (error) {
      throw error
    }
  },

  async getCarById(id) {
    try {
      const response = await axios.get(`/api/cars/${id}`)
      return response.data.car
    } catch (error) {
      throw error
    }
  },

  async createBooking(bookingData) {
    try {
      const response = await axios.post('/api/bookings', bookingData)
      return response.data.booking
    } catch (error) {
      throw error
    }
  },

  async getUserBookings() {
    try {
      const response = await axios.get('/api/bookings/my')
      return response.data.bookings
    } catch (error) {
      throw error
    }
  },

  async cancelBooking(bookingId) {
    try {
      const response = await axios.put(`/api/bookings/${bookingId}/cancel`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
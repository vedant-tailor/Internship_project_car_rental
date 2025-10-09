import React from 'react';
import { format } from 'date-fns';
import { FaCar, FaCalendar, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { carService } from '../services/carService';
import toast from 'react-hot-toast';
// 1. Make sure useNavigate is imported
import { useNavigate } from 'react-router-dom';

const BookingCard = ({ booking, onCancel }) => {
  // 2. Initialize the navigate function
  const navigate = useNavigate();

  const handleCancelBooking = async () => {
    try {
      const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
      if (confirmCancel) {
        await carService.cancelBooking(booking._id);
        toast.success('Booking cancelled successfully');
        onCancel(booking._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  // 3. This function navigates to the mock payment page
  const handlePayment = () => {
    navigate('/mock-payment', { state: { booking } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600';
      case 'Confirmed': return 'text-green-600';
      case 'Active': return 'text-blue-600';
      case 'Completed': return 'text-gray-600';
      case 'Cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-600';
      case 'Paid': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <FaCar className="mr-2 text-primary-600" />
          <h3 className="text-xl font-bold">{booking.car?.name ?? 'Deleted Car'}</h3>
        </div>
        <span className={`font-semibold ${getStatusColor(booking.status)}`}>
          {booking.status}
        </span>
      </div>
      <div className={`mb-4 text-sm font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
        Payment: {booking.paymentStatus}
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
          <span>₹{booking.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-auto space-y-2">
        {booking.status === 'Confirmed' && booking.paymentStatus === 'Pending' && (
          <button 
            onClick={handlePayment}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Pay Now
          </button>
        )}
        {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
          <button 
            onClick={handleCancelBooking}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
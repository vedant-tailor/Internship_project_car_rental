import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const MockPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);

  if (!booking) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Invalid Booking</h1>
        <p>No booking details were found. Please go back to your bookings.</p>
        <button onClick={() => navigate('/bookings')} className="btn-primary mt-4 px-4 py-2 rounded">
          My Bookings
        </button>
      </div>
    );
  }

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/mock-payment', { bookingId: booking._id });
      toast.success('Payment confirmed!');
      setTimeout(() => navigate('/bookings'), 1500); // Redirect after a short delay
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
      <h1 className="text-2xl font-bold text-center mb-4 text-primary-600">Confirm Payment</h1>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Car</p>
          <p className="font-semibold">{booking.car?.name ?? 'Deleted Car'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold">₹{booking.totalAmount.toFixed(2)}</p>
        </div>
        <p className="text-xs text-center text-gray-400 pt-4">
          This is a simulated payment for testing purposes. No real money will be charged.
        </p>
        <button
          onClick={handleConfirmPayment}
          disabled={isLoading}
          className="btn-primary w-full py-3 rounded flex items-center justify-center"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            'Confirm Mock Payment'
          )}
        </button>
      </div>
    </div>
  );
};

export default MockPayment;
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaStripe, FaSpinner } from 'react-icons/fa';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = location.state || {};
  const [isLoading, setIsLoading] = React.useState(false);

  if (!booking) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Invalid Booking</h1>
        <p>No booking details found. Please go back to your bookings.</p>
        <button onClick={() => navigate('/bookings')} className="btn-primary mt-4 px-4 py-2 rounded">
          My Bookings
        </button>
      </div>
    );
  }

  const handleProceedToPayment = async () => {
    setIsLoading(true);
    try {
      // 1. Create a checkout session on the backend
      const response = await axios.post('/api/create-checkout-session', {
        bookingId: booking._id,
      });
      const { id: sessionId } = response.data;

      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Could not initiate payment. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 mt-10">
      <h1 className="text-2xl font-bold text-center mb-4 text-primary-600">Payment Summary</h1>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Car</p>
          <p className="font-semibold">{booking.car?.name ?? 'Deleted Car'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Rental Period</p>
          <p className="font-semibold">{booking.totalDays} days</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold">₹{booking.totalAmount.toFixed(2)}</p>
        </div>
        <p className="text-xs text-center text-gray-400 pt-4">
          You will be redirected to our secure payment partner, Stripe, to complete your transaction.
        </p>
        <button
          onClick={handleProceedToPayment}
          disabled={isLoading}
          className="btn-primary w-full py-3 rounded flex items-center justify-center transition-all"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <>
              <FaStripe className="mr-2" /> Proceed to Secure Payment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;

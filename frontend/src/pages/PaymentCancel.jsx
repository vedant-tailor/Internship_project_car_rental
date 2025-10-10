import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <FaTimesCircle className="text-red-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">Payment Cancelled</h1>
      <p className="text-gray-600 mt-2">
        Your payment process was cancelled. You have not been charged.
      </p>
      <p className="text-gray-600 mt-1">
        You can attempt to pay for your booking again from your bookings page.
      </p>
      <Link to="/bookings" className="btn-primary mt-6 px-6 py-2 rounded">
        Return to My Bookings
      </Link>
    </div>
  );
};

export default PaymentCancel;

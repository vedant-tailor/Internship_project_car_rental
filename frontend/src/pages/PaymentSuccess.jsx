import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'failed'
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setVerificationStatus('failed');
      setMessage('No payment session found. Please contact support.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axios.post('/api/verify-payment', { sessionId });
        if (response.data.success) {
          setVerificationStatus('success');
          setMessage('Your payment was successful and your booking is confirmed!');
        } else {
          setVerificationStatus('failed');
          setMessage(response.data.message || 'Payment verification failed.');
        }
      } catch (error) {
        setVerificationStatus('failed');
        setMessage(error.response?.data?.message || 'An error occurred during verification.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {verificationStatus === 'verifying' && (
        <>
          <FaSpinner className="animate-spin text-primary-600 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">{message}</h1>
          <p className="text-gray-600">Please wait, we are confirming your transaction.</p>
        </>
      )}
      {verificationStatus === 'success' && (
        <>
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">{message}</p>
          <Link to="/bookings" className="btn-primary mt-6 px-6 py-2 rounded">
            View My Bookings
          </Link>
        </>
      )}
      {verificationStatus === 'failed' && (
        <>
          <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Payment Failed</h1>
          <p className="text-gray-600 mt-2">{message}</p>
          <Link to="/bookings" className="btn-primary mt-6 px-6 py-2 rounded">
            Return to Bookings
          </Link>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;

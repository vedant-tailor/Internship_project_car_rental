import React from 'react';
import { FaCar, FaAward, FaHeart } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">About Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to Car Rental, your trusted partner for premium and affordable car rental services. Our mission is to make your travel comfortable, safe, and memorable.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-primary-100 p-5 rounded-full mb-4">
              <FaCar className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Fleet</h3>
            <p className="text-gray-600">
              We offer a wide range of vehicles to suit every need, from compact cars for city trips to spacious SUVs for family vacations. All our cars are well-maintained and regularly serviced.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-primary-100 p-5 rounded-full mb-4">
              <FaAward className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Quality Service</h3>
            <p className="text-gray-600">
              Our team is dedicated to providing you with the best customer experience. We offer 24/7 customer support and a hassle-free booking process to ensure your peace of mind.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-primary-100 p-5 rounded-full mb-4">
              <FaHeart className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Our Commitment</h3>
            <p className="text-gray-600">
              We believe in transparent pricing with no hidden charges. Your safety is our top priority, and we ensure all our vehicles are sanitized and inspected before each rental.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
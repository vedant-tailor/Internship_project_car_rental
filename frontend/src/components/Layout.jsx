import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { FaFacebook, FaInstagram, FaTwitter, FaCar } from 'react-icons/fa';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* --- NEW FOOTER START --- */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand and Social */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center text-white font-bold text-xl mb-4">
                <FaCar className="mr-2" />
                Car Rental
              </Link>
              <p className="text-gray-400">
                Your journey, our priority. Rent the best cars at the best prices.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white"><FaFacebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaInstagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaTwitter size={20} /></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/cars" className="text-gray-400 hover:text-white">Our Fleet</Link></li>
                <li><Link to="/bookings" className="text-gray-400 hover:text-white">My Bookings</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>

              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h3 className="font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest deals.</p>
              <form>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-3 py-2 text-gray-800 rounded-l-md focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 px-4 py-2 rounded-r-md hover:bg-primary-700"
                  >
                    Go
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 py-4">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Car Rental App. All rights reserved.
          </p>
        </div>
      </footer>
      {/* --- NEW FOOTER END --- */}
    </div>
  );
};

export default Layout;
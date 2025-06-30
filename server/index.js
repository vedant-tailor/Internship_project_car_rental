// server/index.js - Complete Car Rental Backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/car_rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  address: { type: String },
  drivingLicense: { type: String }
}, { timestamps: true });

// Car Schema
const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
  transmission: { type: String, enum: ['Manual', 'Automatic'], required: true },
  seats: { type: Number, required: true, min: 2, max: 8 },
  pricePerDay: { type: Number, required: true, min: 0 },
  description: { type: String },
  features: [{ type: String }], // AC, GPS, Bluetooth, etc.
  images: [{ type: String }], // Image file paths
  isAvailable: { type: Boolean, default: true },
  location: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true }
}, { timestamps: true });

// Booking Schema
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  specialRequests: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'], 
    default: 'Pending' 
  }
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Car = mongoose.model('Car', carSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid token' });
  }
};

// Middleware to check admin access
const verifyAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// AUTH ROUTES
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, drivingLicense, isAdmin } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name, email, password: hashedPassword, phone, address, drivingLicense,
      isAdmin: isAdmin || false
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// CAR ROUTES
// Get all cars (public)
app.get('/api/cars', async (req, res) => {
  try {
    const { available, brand, fuelType, transmission, minPrice, maxPrice } = req.query;
    
    let filter = {};
    if (available === 'true') filter.isAvailable = true;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, cars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single car
app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, car });
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add new car (Admin only)
app.post('/api/admin/cars', verifyToken, verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name, brand, model, year, color, fuelType, transmission, seats,
      pricePerDay, description, features, location, registrationNumber
    } = req.body;

    if (!name || !brand || !model || !year || !color || !fuelType || !transmission || 
        !seats || !pricePerDay || !location || !registrationNumber) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const existingCar = await Car.findOne({ registrationNumber });
    if (existingCar) {
      return res.status(400).json({ success: false, message: 'Car with this registration number already exists' });
    }

    const imagePaths = req.files ? req.files.map(file => file.path) : [];
    const featuresArray = features ? (Array.isArray(features) ? features : features.split(',').map(f => f.trim())) : [];

    const car = new Car({
      name, brand, model, year: Number(year), color, fuelType, transmission,
      seats: Number(seats), pricePerDay: Number(pricePerDay), description,
      features: featuresArray, images: imagePaths, location, registrationNumber
    });

    await car.save();
    res.status(201).json({ success: true, message: 'Car added successfully', car });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ success: false, message: 'Server error while adding car' });
  }
});

// Update car (Admin only)
app.put('/api/admin/cars/:id', verifyToken, verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    const updateData = req.body;
    if (updateData.features && typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map(f => f.trim());
    }

    if (req.files && req.files.length > 0) {
      updateData.images = [...(car.images || []), ...req.files.map(file => file.path)];
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: 'Car updated successfully', car: updatedCar });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ success: false, message: 'Server error while updating car' });
  }
});

// Delete car (Admin only)
app.delete('/api/admin/cars/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    // Check if car has active bookings
    const activeBookings = await Booking.find({ 
      car: req.params.id, 
      status: { $in: ['Pending', 'Confirmed', 'Active'] } 
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete car with active bookings' 
      });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting car' });
  }
});

// BOOKING ROUTES
// Create booking
app.post('/api/bookings', verifyToken, async (req, res) => {
  try {
    const {
      carId, startDate, endDate, pickupLocation, dropoffLocation, specialRequests
    } = req.body;

    if (!carId || !startDate || !endDate || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    if (!car.isAvailable) {
      return res.status(400).json({ success: false, message: 'Car is not available' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ success: false, message: 'Start date cannot be in the past' });
    }

    if (end <= start) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      car: carId,
      status: { $in: ['Pending', 'Confirmed', 'Active'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Car is already booked for the selected dates' 
      });
    }

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = totalDays * car.pricePerDay;

    const booking = new Booking({
      user: req.user.userId,
      car: carId,
      startDate: start,
      endDate: end,
      totalDays,
      totalAmount,
      pickupLocation,
      dropoffLocation,
      specialRequests
    });

    await booking.save();
    
    // Populate the booking with car and user details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('car', 'name brand model images pricePerDay')
      .populate('user', 'name email phone');

    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully', 
      booking: populatedBooking 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Server error while creating booking' });
  }
});

// Get user bookings
app.get('/api/bookings/my', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('car', 'name brand model images pricePerDay location')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all bookings (Admin only)
app.get('/api/admin/bookings', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('car', 'name brand model registrationNumber')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update booking status (Admin only)
app.put('/api/admin/bookings/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).populate('user', 'name email phone').populate('car', 'name brand model');

    res.json({ success: true, message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Cancel booking
app.put('/api/bookings/:id/cancel', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (booking.user.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    if (booking.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel completed booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Dashboard stats (Admin only)
app.get('/api/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const availableCars = await Car.countDocuments({ isAvailable: true });
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'Active' });
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalCars,
        availableCars,
        totalUsers,
        totalBookings,
        activeBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
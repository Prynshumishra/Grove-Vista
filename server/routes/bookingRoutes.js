import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Booking from '../models/Booking.js';
import Lead from '../models/Lead.js';

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get logged-in user's bookings
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Book a property
router.post('/', protect, async (req, res) => {
  const { propertyId, title, location, price, beds, baths, sqft, image, name, email, phone } = req.body;

  try {
    // Check if already booked by this user
    const existing = await Booking.findOne({ user: req.user._id, propertyId });
    if (existing) {
      return res.status(400).json({ message: 'You have already booked this property' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      propertyId,
      title,
      location,
      price,
      beds,
      baths,
      sqft,
      image,
      status: 'Confirmed',
    });

    // Create a Lead
    if (name && email && phone) {
      await Lead.create({
        user: req.user._id,
        propertyId,
        name,
        email,
        phone,
      });
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await booking.deleteOne();
    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

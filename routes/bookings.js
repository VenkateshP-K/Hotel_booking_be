const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); // Assuming you have a Booking model

router.get('/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('hotelId');
    if (!booking) {
      return res.status(404).send('Booking not found');
    }
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).send('Server error');
  }
});

router.post('/:bookingId/pay', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).send('Booking not found');
    }
    // Process payment logic here
    res.send('Payment processed');
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
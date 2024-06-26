const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController.js');

// GET bookings for a specific user
router.get('/users/:userId/bookings', bookingController.getBookingsForUser);

// GET bookings for a specific counselor
router.get('/counselors/:counselorId/bookings', bookingController.getBookingsForCounselor);

module.exports = router;

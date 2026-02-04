const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // protect middleware with JWT verification

// routes for  /api/users/profile
router.route('/profile')
  .get(protect, getUserProfile)  // get user data
  .put(protect, updateUserProfile); // ubdate user data 

module.exports = router;
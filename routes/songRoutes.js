const express = require('express');
const router = express.Router();
const { 
  addSong, 
  getSongs, 
  getSongById, 
  updateSong, 
  deleteSong 
} = require('../controllers/songController');
const { protect } = require('../middleware/authMiddleware');

// Private endpoints
router.route('/')
  .post(protect, addSong)   // POST /api/resource
  .get(protect, getSongs);  // GET /api/resource

router.route('/:id')
  .get(protect, getSongById)    // GET /api/resource/:id
  .put(protect, updateSong)    // PUT /api/resource/:id
  .delete(protect, deleteSong); // DELETE /api/resource/:id

module.exports = router;
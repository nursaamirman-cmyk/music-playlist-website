const Song = require('../models/Song');

// Create a new song
// POST /api/resource
exports.addSong = async (req, res) => {
  try {
    const { title, artist, album } = req.body;

    // Data validation
    if (!title || !artist) {
      return res.status(400).json({ message: 'Please add a title and artist' });
    }

    const song = await Song.create({
      title,
      artist,
      album,
      user: req.user._id 
    });

    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all user's songs
// GET /api/resource
exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find({ user: req.user._id });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get specific song by ID
//  GET /api/resource/:id
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (song && song.user.toString() === req.user._id.toString()) {
      res.json(song);
    } else {
      res.status(404).json({ message: 'Song not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Invalid ID format or server error' });
  }
};

// Update a song
// PUT /api/resource/:id
exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (song && song.user.toString() === req.user._id.toString()) {
      song.title = req.body.title || song.title;
      song.artist = req.body.artist || song.artist;
      song.album = req.body.album || song.album;

      const updatedSong = await song.save();
      res.json(updatedSong);
    } else {
      res.status(404).json({ message: 'Song not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a song
// DELETE /api/resource/:id
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (song && song.user.toString() === req.user._id.toString()) {
      await song.deleteOne();
      res.json({ message: 'Song removed' });
    } else {
      res.status(404).json({ message: 'Song not found or not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const Song = require('../models/Song');
const axios = require('axios'); 
const { songSchema } = require('../middleware/validator');

// Create a new song
// POST /api/resource
exports.addSong = async (req, res) => {
  try {
    const { error } = songSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { title, artist, album } = req.body;
    if (!title || !artist) {
      return res.status(400).json({ message: 'Please add a title and artist' });
    }

    let genre = 'Unknown';
    let coverUrl = '';

    // Integration External API (iTunes)
    try {
      const iTunesResponse = await axios.get(
        `https://itunes.apple.com/search?term=${encodeURIComponent(title + ' ' + artist)}&limit=1`
      );

      if (iTunesResponse.data.results.length > 0) {
        const info = iTunesResponse.data.results[0];
        genre = info.primaryGenreName || genre;
        coverUrl = info.artworkUrl100 || coverUrl;
      }
    } catch (apiError) {
      console.error('External API Error:', apiError.message);
      // If the external API fails, we still create the song, just without the additional data.
    }

    const song = await Song.create({
      title,
      artist,
      album,
      genre,    
      coverUrl,  
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
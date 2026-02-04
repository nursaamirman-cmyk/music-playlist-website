const Song = require('../models/Song');

// Creating new song (POST /api/resource)
exports.addSong = async (req, res) => {
  const { title, artist, album } = req.body;
  // Associating the song with the authenticated user
  const song = await Song.create({
    title,
    artist,
    album,
    user: req.user._id 
  });
  res.status(201).json(song);
};

// Get  user's all songs (GET /api/resource)
exports.getSongs = async (req, res) => {
  const songs = await Song.find({ user: req.user._id });
  res.json(songs);
};

// Delete the song (DELETE /api/resource/:id)
exports.deleteSong = async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (song && song.user.toString() === req.user._id.toString()) {
    await song.deleteOne();
    res.json({ message: 'Song removed' });
  } else {
    res.status(404).json({ message: 'Song not found' });
  }
};
const User = require('../models/User');

// Get profile  (GET /api/users/profile)
exports.getUserProfile = async (req, res) => {
  
  const user = await User.findById(req.user._id).select('-password'); 
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// ubdate profile  (PUT /api/users/profile)
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password; // hashed in the model pre-save hook
    }
    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, username: updatedUser.username, email: updatedUser.email });
  } else {
    res.status(404).json({ message: 'User not found' }); 
  }
};
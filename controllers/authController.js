const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generation of JWT Token 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Registration of the User
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};


// Login  
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: checking whether the user sent any data at all
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    //  Searching for the user by email
    const user = await User.findOne({ email });

    // Checking password
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      });
    } else {
      // If the user is not found or the password does not match, we send 401 errors
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // Generic server error
    res.status(500).json({ message: 'Server Error' });
  }
};
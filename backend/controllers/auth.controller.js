// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateToken } = require('../config/utils.config');
const cloudinary = require('../config/cloudinary.config');

// SIGNUP CONTROLLER
const signup = async (req, res) => {
  try {
    const { username, email, password, roles, name, bio, avatarUrl } = req.body;

    if (!username || !email || !password || !roles) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const allowedRoles = ['user', 'chef'];
    const invalidRoles = roles.filter(role => !allowedRoles.includes(role));
    if (invalidRoles.length > 0) {
      return res.status(403).json({ message: `You are not allowed to register with role(s): ${invalidRoles.join(', ')}` });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      passwordHash,
      roles,
      profile: {
        name,
        avatarUrl,
        bio,
      },
    });

    generateToken(newUser._id, res);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login start');
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('Generating token...');
    generateToken(user, res);
    console.log('Token generated and cookie set');

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error during signin' });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: 'avatars',
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'profile.avatarUrl': uploadResponse.secure_url,
          updatedAt: new Date(),
        },
      },
      { new: true }
    ).select('-passwordHash');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const checkAuth = async (req, res) => {
  const token = req.cookies.jwt;
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};

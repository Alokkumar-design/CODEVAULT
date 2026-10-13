const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

async function signup(req, res) {
  const { username, password, email } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or username already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET_KEY || "codevault_default_secret_key",
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, userId: savedUser._id });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).json({ message: "Server error during registration." });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY || "codevault_default_secret_key",
      { expiresIn: "7d" }
    );

    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).json({ message: "Server error during login." });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users : ", err.message);
    res.status(500).json({ message: "Server error fetching users." });
  }
}

async function getUserProfile(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password").populate("repositories");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile : ", err.message);
    res.status(500).json({ message: "Server error fetching user profile." });
  }
}

async function updateUserProfile(req, res) {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      message: "Profile updated successfully!",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    console.error("Error updating profile : ", err.message);
    res.status(500).json({ message: "Server error updating profile." });
  }
}

async function deleteUserProfile(req, res) {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "User profile deleted successfully!" });
  } catch (err) {
    console.error("Error deleting user : ", err.message);
    res.status(500).json({ message: "Server error deleting user profile." });
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");
const { Types } = require("mongoose");

const register = async (req, res) => {
  try {
    const { username, password, role, company } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "user", // Default to 'user' if no role is provided
      company: company,
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, company: user.company},
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateUser = async (req, res) => {
  const { _id } = req.query;
  const { username, role, company } = req.body;

  try {
    // Check if the new username already exists
    const existingUser = await User.findOne({ username, _id: { $ne: _id } });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { username, role, company },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getUser = async (req, res) => {
  const { searchTerm } = req.query;

  // Only allow admins to update farmers
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied" });
    }

  try {
    let user;

    // Check if the searchTerm is a valid ObjectId
    if (Types.ObjectId.isValid(searchTerm)) {
      // If valid, search by _id directly
      user = await User.findOne({ _id: searchTerm });
    } else {
      // Otherwise, search by username or role
      user = await User.findOne({
        $or: [{ username: searchTerm }, { role: searchTerm }],
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getFilteredUser = async (req, res) => {
  const { searchTerm } = req.query;

  try {
    let user;

    //Get all users
    if(!searchTerm){
      user = await User.find();
    }

    // Check if the searchTerm is a valid ObjectId
    else if (Types.ObjectId.isValid(searchTerm)) {
      // If valid, search by _id directly
      user = await User.findOne({ _id: searchTerm });
    } else {
      // Otherwise, search by username or role
      user = await User.find({
        $or: [{ username: searchTerm }, { role: searchTerm }],
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  register,
  login,
  updateUser,
  getUser,
  getAllUsers,
  getFilteredUser,
};

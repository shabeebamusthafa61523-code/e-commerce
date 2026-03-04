const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
//   if (req.body.password !== req.body.confirmPassword) {
//   return res.status(400).json({ message: "Passwords do not match" });
// }

  try {
    console.log("REGISTER BODY:", req.body);

    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // ✅ FIXED

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= PROTECT MIDDLEWARE =================
// const protect = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token" });
//   }

//   try {
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next(); // ✅ important
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// ================= GET PROFILE =================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      address: user.address || "",
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: req.token, // Send back existing token or generate new one
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// ✅ EXPORT EVERYTHING ONCE
module.exports = {
  registerUser,
  loginUser,
  getMe,
   getUserProfile, 
   updateUserProfile ,
};

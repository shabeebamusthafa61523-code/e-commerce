const Order = require("../models/Order");
const User = require("../models/User");

// @desc    Get all orders assigned to the logged-in delivery partner
// @route   GET /api/delivery/my-orders
// @access  Private/Delivery
const getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.user._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery partner availability (Online/Offline)
// @route   PUT /api/delivery/availability
// @access  Private/Delivery
const updateAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.isAvailable = req.body.isAvailable;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        isAvailable: updatedUser.isAvailable,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Get all available delivery partners for assignment
// @route   GET /api/delivery/partners/available
// @access  Private/Admin
const getAvailablePartners = async (req, res) => {
  try {
    const partners = await User.find({ role: "delivery", isAvailable: true })
      .select("-password");
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle delivery partner availability (Admin control)
// @route   PUT /api/delivery/:id/toggle
// @access  Private/Admin
const toggleAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user && user.role === "delivery") {
      // Logic Check: Prevent going offline if there are active deliveries
      const activeOrders = await Order.countDocuments({
        deliveryPartner: req.params.id,
        orderStatus: { $in: ['assigned', 'picked up', 'out for delivery'] }
      });

      if (activeOrders > 0 && req.body.isAvailable === false) {
        return res.status(400).json({
          message: `Cannot go offline. Partner has ${activeOrders} active deliveries.`
        });
      }

      user.isAvailable = req.body.isAvailable;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        isAvailable: updatedUser.isAvailable,
      });
    } else {
      res.status(404).json({ message: "Delivery partner not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during toggle" });
  }
};

// @desc    Register a new delivery partner
// @route   POST /api/delivery/register
// @access  Private/Admin
const registerPartner = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // Password hashing should be handled in User Model Middleware
      role: "delivery",
      isAvailable: false,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAvailable: user.isAvailable,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign partner to order
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
const assignPartnerToOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.deliveryPartner = req.body.partnerId;
      order.orderStatus = 'assigned';
      order.assignedAt = Date.now();

      const updatedOrder = await order.save();

      // Socket.io integration for real-time alerts
      if (req.io) {
        req.io.to(req.body.partnerId).emit("NEW_DELIVERY_ASSIGNED", {
          orderId: updatedOrder._id,
          address: updatedOrder.shippingAddress?.street || "No Address Provided"
        });
      }
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders available for pickup (Marketplace)
// @route   GET /api/delivery/marketplace
const getMarketplaceOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      orderStatus: 'placed',
      deliveryPartner: { $exists: false } // Checks for null or undefined
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery partner profile (Contact & Vehicle)
// @route   PUT /api/delivery/profile
// @access  Private
const updateDeliveryProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.phone = req.body.phone || user.phone;
      user.vehicleNumber = req.body.vehicleNumber || user.vehicleNumber;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        vehicleNumber: updatedUser.vehicleNumber,
        isAdmin: updatedUser.isAdmin,
        role: updatedUser.role,
        token: req.headers.authorization.split(' ')[1], 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Exporting all functions using CommonJS
module.exports = {
  getMyDeliveries,
  updateAvailability,
  getAvailablePartners,
  toggleAvailability,
  registerPartner,
  assignPartnerToOrder,
  getMarketplaceOrders,
  updateDeliveryProfile
};
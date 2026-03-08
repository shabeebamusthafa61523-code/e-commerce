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
    const { partnerId } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the order with the partner and move it to processing
    order.deliveryPartner = partnerId;
    order.orderStatus = "processing";
    order.assignedAt = Date.now(); // Useful for tracking delivery time later

    const updatedOrder = await order.save();
    
    // Populate partner details if you need to show them in the UI immediately
    const populatedOrder = await updatedOrder.populate("deliveryPartner", "name phone");

    res.json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders available for pickup (Marketplace)
// @route   GET /api/delivery/marketplace
// @desc    Get all orders available for pickup (Marketplace)
// @route   GET /api/delivery/marketplace
const getMarketplaceOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      // FIX: Check for both 'placed' and 'processing' to be safe
      orderStatus: { $in: ['placed', 'processing'] }, 
      // FIX: Ensure the partner is either null, undefined, or doesn't exist
      $or: [
        { deliveryPartner: { $exists: false } },
        { deliveryPartner: null }
      ]
    }).populate("items.product", "name price image")
    .sort({ createdAt: -1 });

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

// Add this to your deliveryController.js
const getAllPartners = async (req, res) => {
  try {
    // Find all users with the role 'delivery'
    const partners = await User.find({ role: "delivery" }).select("-password");
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fleet registry" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // SECURITY: Ensure the person updating is the assigned partner
    if (order.deliveryPartner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized: You are not assigned to this order" });
    }

    order.orderStatus = status;

    // Log delivery time for earnings
    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update your module.exports at the bottom
module.exports = { 
  getMyDeliveries, 
  updateAvailability, 
  getAvailablePartners,
  getAllPartners, // <--- Add here
  toggleAvailability,
  registerPartner,
  assignPartnerToOrder,
  getMarketplaceOrders,
  updateDeliveryProfile,
  updateOrderStatus
};
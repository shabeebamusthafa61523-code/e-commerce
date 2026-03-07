const Order = require("../models/Order");
const User = require("../models/User");

// @desc    Get all orders assigned to the logged-in delivery partner
// @route   GET /api/delivery/my-orders
// @access  Private/Delivery
const getMyDeliveries = async (req, res) => {
  const orders = await Order.find({ deliveryPartner: req.user._id })
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Update delivery partner availability (Online/Offline)
// @route   PUT /api/delivery/availability
// @access  Private/Delivery
// backend/controllers/deliveryController.js
const updateAvailability = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.isAvailable = req.body.isAvailable;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      isAvailable: updatedUser.isAvailable,
      // ... other fields
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Admin: Get all available delivery partners for assignment
// @route   GET /api/delivery/partners/available
// @access  Private/Admin
const getAvailablePartners = async (req, res) => {
  const partners = await User.find({ role: "delivery", isAvailable: true })
    .select("-password");
  res.json(partners);
};
// controllers/deliveryController.js
// @desc    Toggle delivery partner availability
// @route   PUT /api/delivery/:id/toggle
// @access  Private/Admin
const toggleAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user && user.role === "delivery") {
      // Set to the value sent from the frontend toggle
      user.isAvailable = req.body.isAvailable;
      // controllers/deliveryController.js
  const activeOrders = await Order.countDocuments({ 
    deliveryPartner: req.params.id, 
    orderStatus: { $in: ['assigned', 'picked up', 'out for delivery'] } 
  });

  if (activeOrders > 0 && req.body.isAvailable === false) {
    return res.status(400).json({ 
      message: `Cannot go offline. Partner has ${activeOrders} active deliveries.` 
    });
  }


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
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Create the user with the 'delivery' role
  const user = await User.create({
    name,
    email,
    password, // Your User model should have a middleware to hash this!
    role: "delivery",
    isAvailable: false, // Start as offline by default
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
};
// @desc    Assign partner to order
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
const assignPartnerToOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.deliveryPartner = req.body.partnerId;
    order.orderStatus = 'Assigned'; // Moves it to the rider's dashboard
    order.assignedAt = Date.now();  // Track assignment time for logistics analytics

    const updatedOrder = await order.save();
    // Add this after order.save()
if (req.io) {
  req.io.to(req.body.partnerId).emit("NEW_DELIVERY_ASSIGNED", {
    orderId: updatedOrder._id,
    address: updatedOrder.shippingAddress.street
  });
}
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};
// @desc    Get all orders available for pickup (Marketplace)
// @route   GET /api/delivery/marketplace
const getMarketplaceOrders = async (req, res) => {
  // Find orders that are 'placed' but have no rider assigned yet
  const orders = await Order.find({ 
    orderStatus: 'placed', 
    deliveryPartner: { $exists: false } // or null
  }).sort({ createdAt: -1 });
  
  res.json(orders);
};
module.exports = { 
  getMyDeliveries, 
  updateAvailability, 
  getAvailablePartners ,
  toggleAvailability,
  registerPartner,
  assignPartnerToOrder,
  getMarketplaceOrders
};
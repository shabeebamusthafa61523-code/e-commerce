const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc Create new order with snapshot data (Image & Price)
// @route POST /api/orders
const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    let totalAmount = 0;

    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");

        const activePrice = product.isFlashSale && product.discountPrice > 0 
          ? product.discountPrice 
          : product.price;

        totalAmount += activePrice * item.quantity;

        return {
          product: product._id,
          name: product.name,
          price: activePrice,
          image: product.images?.[0] || "",
          quantity: item.quantity,
        };
      })
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      isPaid: false,
      orderStatus: "processing",
    });

    // 🚀 BROADCAST: Notify all delivery partners
    if (req.io) {
      req.io.emit('new_marketplace_order', {
        message: "New Shipment Available!",
        orderId: order._id,
        amount: order.totalAmount,
        location: shippingAddress.city || "Nearby", // Helps riders decide quickly
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc Cancel an order
// @route PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to cancel this order" });
    }

    if (order.orderStatus !== "processing") {
      return res.status(400).json({ message: "Order cannot be cancelled after shipping" });
    }

    order.orderStatus = "cancelled";
    const updatedOrder = await order.save();

    res.json({ message: "Order cancelled successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'image name price') 
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
console.log("BACKEND LOG:", order.shippingAddress);
  res.json(order);
};

const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentMethod = "Razorpay";
  order.paymentStatus = "paid";
  await order.save();

  res.json({ message: "Payment successful" });
};

// backend/controllers/orderController.js

const claimOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const partnerId = req.user._id;

    // ATOMIC UPDATE: Only update if deliveryPartner is still null
    const order = await Order.findOneAndUpdate(
      { 
        _id: orderId, 
        deliveryPartner: null // This is the "Lock"
      },
      { 
        $set: { 
          deliveryPartner: partnerId,
          orderStatus: 'Assigned',
          assignedAt: Date.now()
        } 
      },
      { new: true } // Returns the updated document
    ).populate('deliveryPartner', 'name email');

    if (!order) {
      // If no order was found with deliveryPartner: null, it means someone else got it
      return res.status(400).json({ 
        message: "Too late! This order has already been claimed by another rider." 
      });
    }

    // BROADCAST: If you have Socket.io set up, notify others to remove this from their list
    if (req.io) {
      req.io.emit('order_claimed', { orderId: order._id });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { createOrder, getUserOrders, cancelOrder, getOrderById, updateOrderToPaid ,claimOrder};
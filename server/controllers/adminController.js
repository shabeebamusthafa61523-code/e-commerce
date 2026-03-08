const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");


// ================= USERS =================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


// ================= DASHBOARD STATS =================
const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalUsers,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};


// ================= ORDERS =================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      // THIS IS THE MISSING PIECE:
      .populate("deliveryPartner", "name email phone") 
      .sort({ createdAt: -1 });
      
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


// ================= TOP PRODUCTS =================
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ numReviews: -1, rating: -1 })
      .limit(5);

    res.status(200).json(products);
  } catch (error) {
    console.error("Top Products Error:", error);
    res.status(500).json({ message: "Failed to fetch top products" });
  }
};


// ================= TOTAL SALES =================
const getTotalSales = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: "paid" });

    const totalSales = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.status(200).json({ totalSales });
  }catch (error) {
  console.error("Dashboard Stats Error:", error);
  res.status(500).json({ message: error.message });
}
};


// ================= LOW STOCK PRODUCTS =================
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lte: 5 } });

    res.status(200).json(products);
  } catch (error) {
    console.error("Low Stock Error:", error);
    res.status(500).json({ message: "Failed to fetch low stock products" });
  }
};


const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = status;
  await order.save();

  res.json({ message: "Order status updated" });
};


module.exports = {
  getAllUsers,
  getDashboardStats,
  getAllOrders,
  getTopProducts,
  getTotalSales,
  getLowStockProducts,
  updateOrderStatus,
};
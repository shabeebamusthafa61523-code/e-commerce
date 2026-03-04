const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Product = require("../models/Product");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let totalAmount = 0;

    const validatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) throw new Error("Product not found");

        // ✅ FIX: Check for Flash Sale price
        const currentPrice = product.isFlashSale && product.discountPrice > 0 
          ? product.discountPrice 
          : product.price;

        totalAmount += currentPrice * item.quantity;

        return {
          product: product._id,
          name: product.name,
          price: currentPrice, // Use the flash sale price if active
          image: product.images?.[0] || "",
          quantity: item.quantity,
        };
      })
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Rounded to prevent float errors
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      validatedItems,
      totalAmount,
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    let totalAmount = 0;

    const validatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) throw new Error("Product not found");

        // ✅ FIX: Securely recalculate using Flash Sale price
        const currentPrice = product.isFlashSale && product.discountPrice > 0 
          ? product.discountPrice 
          : product.price;

        totalAmount += currentPrice * item.quantity;

        return {
          product: product._id,
          name: product.name,
          price: currentPrice,
          image: product.images?.[0] || "",
          quantity: item.quantity,
        };
      })
    );
    
    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      totalAmount,
      paymentStatus: "paid",
      orderStatus: "processing",
      shippingAddress: address,
      paymentMethod: "Razorpay",
      isPaid: true,
      paidAt: Date.now(), 
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    res.json({ success: true, order });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
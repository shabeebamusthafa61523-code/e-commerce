const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deliveryPartner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: null 
    },
    items: [
      {
       product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String }, // <--- CHANGE THIS FROM 'images' TO 'image'
      quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    // paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    orderStatus: { 
      type: String, 
enum: [
        "processing", 
        "assigned",      // Admin has picked a driver
        "picked up",     // Driver has the groceries
        "out for delivery", 
        "delivered", 
        "cancelled"
      ],
            default: "processing" 
    },
   shippingAddress: {
  fullName: String,
  phone: String,
  street: String,
  city: String,
  pincode: String,
},
paymentMethod: {
  type: String,
  required: true,
},

isPaid: {
  type: Boolean,
  default: false,
},

paidAt: {
  type: Date,
},
assignedAt: Date,
    pickedUpAt: Date,
    
deliveredAt: Date,
razorpayOrderId: String,
razorpayPaymentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
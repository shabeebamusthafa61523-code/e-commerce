// models/DeliveryPartner.js
const mongoose = require("mongoose");

const deliveryPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // For rider login
  vehicleNumber: { type: String, required: true },
  city: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }, // Toggle for "On Duty"
  accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
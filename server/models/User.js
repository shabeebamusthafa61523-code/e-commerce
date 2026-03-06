const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
role: { 
      type: String, 
      enum: ["user", "admin", "delivery"], 
      default: "user" 
    },// Specific fields for the Delivery Role
    isAvailable: { 
      type: Boolean, 
      default: true // Only relevant if role is "delivery"
    },
    vehicleNumber: { type: String }, 
    currentLocation: {
      lat: Number,
      lng: Number
    }
    },
  { timestamps: true }
);

// 🔥 HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// 🔥 MATCH PASSWORD
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

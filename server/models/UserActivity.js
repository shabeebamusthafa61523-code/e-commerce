const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    viewedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cartProducts: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    orderedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserActivity", userActivitySchema);

const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

// FIX: Removed the old local uploadMiddleware to avoid naming conflicts
// Only import the Cloudinary upload config
const { upload } = require("../config/cloudinary"); 

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createBulkProducts,
} = require("../controllers/productController");

// --- Public routes ---
router.get("/", getProducts);
router.get("/:id", getProductById);

// --- Admin routes ---

// Create Product: upload.single("image") now sends directly to Cloudinary
router.post(
  "/",
  protect,
  admin,
  upload.single("image"), 
  createProduct
);

// Bulk insert
router.post("/bulk", protect, admin, createBulkProducts);

// Update Product: Now handles cloud upload automatically
router.put(
  "/:id", 
  protect, 
  admin, 
  upload.single("image"), 
  updateProduct
);

// Delete Product
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
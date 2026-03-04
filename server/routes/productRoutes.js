const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); 

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createBulkProducts,
} = require("../controllers/productController");



// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin routes
router.post(
  "/",
  protect,
  admin,
  upload.single("image"), // 👈 Now this works
  createProduct
);

router.post("/bulk", protect, admin, createBulkProducts);
// router.post("/", async (req, res) => {
//   console.log(req.body);
//   res.json(req.body);
// });
// In your backend route
// router.get("/products", async (req, res) => {
//   const searchQuery = req.query.search;
//   try {
//     const products = await Product.find({
//       name: { $regex: `^${searchQuery}$`, $options: "i" } // exact match, case-insensitive
//     });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
router.put("/:id", protect, admin, upload.single("image"), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
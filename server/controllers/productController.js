const Product = require("../models/Product");

// GET all products
// GET all products (with Search and Category filtering)
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    // 1. Filter by Category (if provided)
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // 2. Filter by Search Keyword (if provided)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } } // Optional: search in description too
      ];
    }

    // Lean for better performance since we are just reading data
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE Product
const createProduct = async (req, res) => {
  try {
    const { name, brand, price, discountPrice, category, stock, description, isOrganic, isFlashSale } = req.body;

    const product = new Product({
      name, 
      brand, 
      price: Number(price), 
      discountPrice: Number(discountPrice) || 0,
      category, 
      stock: Number(stock), 
      description,
      isOrganic: isOrganic === 'true' || isOrganic === true,
      isFlashSale: isFlashSale === 'true' || isFlashSale === true,
      images: [], 
    });

    // When using Cloudinary, req.file.path contains the full HTTPS URL
    if (req.file) {
      product.image = req.file.path; 
      product.images.push(req.file.path);
    }

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  }  catch (error) {
    // This will print the actual error message and stack trace in Render logs
    console.error("Detailed Create Error:", {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(400).json({ message: error.message });
  }
};

// UPDATE Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update text fields
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price ? Number(req.body.price) : product.price;
    product.discountPrice = req.body.discountPrice !== undefined ? Number(req.body.discountPrice) : product.discountPrice;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    product.description = req.body.description || product.description;
    
    if (req.body.isOrganic !== undefined) {
      product.isOrganic = req.body.isOrganic === 'true' || req.body.isOrganic === true;
    }
    if (req.body.isFlashSale !== undefined) {
      product.isFlashSale = req.body.isFlashSale === 'true' || req.body.isFlashSale === true;
    }

    // Update image if a new one is uploaded via Cloudinary
    if (req.file) {
      product.image = req.file.path;
      product.images = [req.file.path];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Update failed: " + error.message });
  }
};

// DELETE Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BULK Create
const createBulkProducts = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ message: "Array required" });
    const products = await Product.insertMany(req.body);
    res.status(201).json({ count: products.length, products });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createBulkProducts 
};
const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    let products = await Product.find(filter).lean();

    // FIX: Force HTTPS to prevent "Mixed Content" errors on Render
    const host = "https://" + req.get("host");

    const updatedProducts = products.map(p => {
      // Format the main 'image'
      if (p.image && !p.image.startsWith('http')) {
        // Ensure path starts with a slash
        const path = p.image.startsWith('/') ? p.image : `/${p.image}`;
        p.image = host + path;
      }

      // Format the 'images' array
      if (Array.isArray(p.images)) {
        p.images = p.images.map(img => 
          img.startsWith('http') ? img : host + (img.startsWith('/') ? img : `/${img}`)
        );
      }
      return p;
    });

    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    const host = "https://" + req.get("host");
    if (product.image && !product.image.startsWith('http')) {
      const path = product.image.startsWith('/') ? product.image : `/${product.image}`;
      product.image = host + path;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { 
      name, brand, price, discountPrice, category, 
      stock, description, isOrganic, isFlashSale 
    } = req.body;

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

    if (req.file) {
      // Store relative path in DB: /uploads/filename.jpg
      const filePath = `/uploads/${req.file.filename}`;
      product.image = filePath;
      product.images.push(filePath);
    }

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

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

    if (req.file) {
      const filePath = `/uploads/${req.file.filename}`;
      product.image = filePath;
      product.images = [filePath]; 
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting product" });
  }
};

// @desc    Bulk create products
const createBulkProducts = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: "Request body must be an array" });
    }
    const products = await Product.insertMany(req.body);
    res.status(201).json({
      message: "Bulk products inserted successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// IMPORTANT: Single unified export to prevent overwriting
module.exports = { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createBulkProducts 
};
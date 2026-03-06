const Product = require("../models/Product");

// GET all products
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    let products = await Product.find(filter).lean();

    // FIX: Force HTTPS to prevent "Mixed Content" on Vercel
// Add this helper inside your controller functions
const isLocal = req.get("host").includes("localhost");
const protocol = isLocal ? "http://" : "https://";
const host = protocol + req.get("host");

    const updatedProducts = products.map(p => {
      if (p.image && !p.image.startsWith('http')) {
        const cleanPath = p.image.startsWith('/') ? p.image : `/${p.image}`;
        p.image = host + cleanPath;
      }

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

// GET single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

// Add this helper inside your controller functions
const isLocal = req.get("host").includes("localhost");
const protocol = isLocal ? "http://" : "https://";
const host = protocol + req.get("host");

if (product.image && !product.image.startsWith('http')) {
      const cleanPath = product.image.startsWith('/') ? product.image : `/${product.image}`;
      product.image = host + cleanPath;
    }

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
      name, brand, price: Number(price), discountPrice: Number(discountPrice) || 0,
      category, stock: Number(stock), description,
      isOrganic: isOrganic === 'true' || isOrganic === true,
      isFlashSale: isFlashSale === 'true' || isFlashSale === true,
      images: [], 
    });

    if (req.file) {
      const filePath = `/uploads/${req.file.filename}`;
      product.image = filePath;
      product.images.push(filePath);
    }

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE Product
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
    
    if (req.body.isOrganic !== undefined) product.isOrganic = req.body.isOrganic === 'true' || req.body.isOrganic === true;
    if (req.body.isFlashSale !== undefined) product.isFlashSale = req.body.isFlashSale === 'true' || req.body.isFlashSale === true;

    if (req.file) {
      const filePath = `/uploads/${req.file.filename}`;
      product.image = filePath;
      product.images = [filePath];
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

// ONE SINGLE EXPORT AT THE END
module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createBulkProducts };
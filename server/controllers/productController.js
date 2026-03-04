const Product = require("../models/Product");



// GET all products
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Using .lean() to get plain JS objects for easier modification
    let products = await Product.find(filter).lean();

    const host = req.protocol + "://" + req.get("host");

    const updatedProducts = products.map(p => {
      // 1. Correctly format the main 'image' string
      if (p.image && !p.image.startsWith('http')) {
        p.image = host + p.image;
      }

      // 2. Correctly format every string in the 'images' array
      if (Array.isArray(p.images)) {
        p.images = p.images.map(img => 
          img.startsWith('http') ? img : host + img
        );
      }
      return p;
    });

    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE Product (Admin)
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
      // Handle Boolean conversion from FormData strings
      isOrganic: isOrganic === 'true' || isOrganic === true,
      isFlashSale: isFlashSale === 'true' || isFlashSale === true,
      images: [], 
    });

    if (req.file) {
      const filePath = `/uploads/${req.file.filename}`;
      product.image = filePath; // Main path
      product.images.push(filePath); // Array path
    }

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE Product (Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update basic fields
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price ? Number(req.body.price) : product.price;
    product.discountPrice = req.body.discountPrice !== undefined ? Number(req.body.discountPrice) : product.discountPrice;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    product.description = req.body.description || product.description;
    
    // Handle Boolean updates carefully
    if (req.body.isOrganic !== undefined) {
      product.isOrganic = req.body.isOrganic === 'true' || req.body.isOrganic === true;
    }
    if (req.body.isFlashSale !== undefined) {
      product.isFlashSale = req.body.isFlashSale === 'true' || req.body.isFlashSale === true;
    }

    // Handle new image upload
    if (req.file) {
      const filePath = `/uploads/${req.file.filename}`;
      product.image = filePath;
      product.images = [filePath]; // Resetting to new image
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

// ... keep getProductById, createBulkProducts, and deleteProduct as they are

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const host = req.protocol + "://" + req.get("host");
    if (product.image) product.image = host + product.image;

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE / UPDATE / DELETE (Admin)
// const createProduct = async (req, res) => {
//   try {
//     const { name, brand, price, category, stock, description, isOrganic } = req.body;

//     const product = new Product({
//       name,
//       brand,
//       price,
//       category,
//       stock,
//       description,
//       isOrganic,
//       images: [], // initialize empty array
//     });

//     if (req.file) {
//       const host = req.protocol + "://" + req.get("host"); // http://localhost:5000
//       product.images.push(host + `/uploads/${req.file.filename}`);
//     }

//     const createdProduct = await product.save();
//     res.status(201).json(createdProduct);

//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: error.message });
//   }
// };

//bulk
const createBulkProducts = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    // Must send array from Postman
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Request body must be an array of products",
      });
    }

    // Optional: Validate required fields manually
    for (let item of req.body) {
      if (!item.name || !item.price || !item.category) {
        return res.status(400).json({
          message: "Each product must have name, price, and category",
        });
      }
    }

    const products = await Product.insertMany(req.body);

    res.status(201).json({
      message: "Bulk products inserted successfully",
      count: products.length,
      products,
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBulkProducts,
};



// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

// console.log("BODY:", req.body);
//     console.log("FILE:", req.file)

//     // Update fields
//     product.name = req.body.name || product.name;
//     product.brand = req.body.brand || product.brand;
//     product.price = req.body.price || product.price;
//     product.category = req.body.category || product.category;
//     product.stock = req.body.stock || product.stock;
//     product.description = req.body.description || product.description;
//     product.nutritionInfo =
//       req.body.nutritionInfo || product.nutritionInfo;
//     product.isOrganic =
//       req.body.isOrganic !== undefined
//         ? req.body.isOrganic
//         : product.isOrganic;

//     // If new image uploaded
//     if (req.file) {
//   const host = req.protocol + "://" + req.get("host");
//   // Add to images array or replace first image
//   product.images = [host + `/uploads/${req.file.filename}`];
// }
//     const updatedProduct = await product.save(); // 🔥 VERY IMPORTANT

//     res.json(updatedProduct);
//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(500).json({ message: "Server error while updating product" });
//   }
// };


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne(); // modern way

    res.json({ message: "Product removed successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};




module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct,createBulkProducts };

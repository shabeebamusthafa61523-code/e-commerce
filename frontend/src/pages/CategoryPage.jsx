// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/product/ProductCard";
import SkeletonCard from "../components/ai/Recommendations"; // Move your skeleton to a separate file

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // Fetch products specifically for this category
        const res = await API.get(`/products?category=${categoryName}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "low") return a.price - b.price;
    if (sortBy === "high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b pb-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900">{categoryName}</h1>
          <p className="text-gray-500 mt-2">{products.length} Items found</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <label className="text-sm font-bold text-gray-400 uppercase">Sort By:</label>
          <select 
            className="bg-white border border-gray-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {sortedProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/ProductSlice";
import ProductList from "../components/product/ProductList";
import { useLocation } from "react-router-dom";

// Enhanced icons with fallback
const categoryIcons = {
  vegetables: "🥦",
  fruits: "🍎",
  dairy: "🥛",
  rice: "🍚",
  grains: "🌾",
  snacks: "🍪",
  spices: "🧂",
  Chocolates: "🍫",
};

export default function Products() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search") || "";
    setSearchQuery(query);
  }, [location.search]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin"></div>
    </div>
  );

  const categories = [...new Set((products || []).map((product) => product.category))];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Explore All Products
          </h1>
          <p className="text-slate-500 font-medium italic">
            {searchQuery ? `Showing results for "${searchQuery}"` : "Freshness delivered to your doorstep every day."}
          </p>
        </div>

        {/* Premium Category Navbar */}
        <div className="sticky top-20 z-30 mb-12">
          <div className="flex items-center gap-3 overflow-x-auto py-4 no-scrollbar">
            {/* "All" Category Button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm border ${
                selectedCategory === null
                  ? "bg-slate-900 text-white border-slate-900 shadow-slate-200 scale-105"
                  : "bg-white text-slate-600 border-slate-100 hover:border-green-200 hover:bg-green-50/30"
              }`}
            >
              All Items
            </button>

            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm border ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white border-green-600 shadow-green-100 scale-105"
                    : "bg-white text-slate-600 border-slate-100 hover:border-green-200 hover:bg-green-50/30"
                }`}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              >
                <span className="text-xl">{categoryIcons[cat] || "🏷️"}</span>
                <span className="capitalize">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid Container */}
        <div className="min-h-[400px]">
          {filteredProducts.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <ProductList products={filteredProducts} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <span className="text-6xl mb-4 opacity-20">🔍</span>
              <p className="text-slate-400 font-bold text-xl tracking-tight">Oops! No products found.</p>
              <button 
                onClick={() => {setSelectedCategory(null); setSearchQuery("")}} 
                className="mt-4 text-green-600 font-black uppercase text-xs tracking-widest hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
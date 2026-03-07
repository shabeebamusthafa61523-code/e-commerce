import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/ProductSlice";
import ProductList from "../components/product/ProductList";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get Search Params from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  const { products, loading } = useSelector((state) => state.product);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 1. Fetch products from API whenever the search query in URL changes
  useEffect(() => {
    // This calls your API with ?search=... logic
    dispatch(fetchProducts({ search: searchQuery }));
    
    // Reset category filter when a new search is performed to show all results
    setSelectedCategory(null); 
  }, [dispatch, searchQuery]);

  // 2. Frontend filtering for Categories
  // We keep this on the frontend for instant UI feedback without loading spinners
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesCategory;
  });

  // Unique categories derived from the current result set
  const categories = [...new Set((products || []).map((product) => product.category))];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6 font-sans mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {searchQuery ? `Results for "${searchQuery}"` : "Explore All Products"}
            </h1>
            <p className="text-slate-500 font-medium italic">
              {searchQuery 
                ? `We found ${filteredProducts.length} items matching your search.` 
                : "Freshness delivered to your doorstep every day."}
            </p>
          </div>

          {searchQuery && (
            <button 
              onClick={() => navigate("/products")}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Premium Category Navbar */}
        <div className="sticky top-24 z-30 mb-12">
          <div className="flex items-center gap-3 overflow-x-auto py-4 no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm border ${
                selectedCategory === null
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 scale-105"
                  : "bg-white text-slate-600 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30"
              }`}
            >
              All Items
            </button>

            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm border ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-100 scale-105"
                    : "bg-white text-slate-600 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30"
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
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl grayscale opacity-40">🔍</span>
              </div>
              <h3 className="text-slate-900 font-black text-2xl tracking-tight mb-2">No matching products</h3>
              <p className="text-slate-400 font-medium mb-8">Try adjusting your search or category filters.</p>
              
              <button 
                onClick={() => {setSelectedCategory(null); navigate("/products")}} 
                className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
              >
                Show all groceries
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
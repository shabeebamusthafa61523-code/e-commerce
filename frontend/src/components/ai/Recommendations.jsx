import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../services/api";
import ProductCard from "../product/ProductCard";
import { useCart } from "../../context/CartContext";

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="bg-gray-200 h-40 w-full rounded-2xl mb-4" />
    <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
  </div>
);

export default function Recommendations({ currentProductId, category }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const token = useSelector(state => state.auth.userInfo?.token);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // If no token, we can't fetch personalized data
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await API.post(
          "/ai/recommend",
          { 
            productId: currentProductId, 
            category: category 
          }, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setItems(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [token, currentProductId, category]); // Added category to dependency

  // --- RENDER LOGIC ---

  // 1. Show Skeletons while loading
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // 2. Hide section if no items found
  if (!items.length) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map(item => (
          <div key={item._id} className="relative group">
            {/* Professional Touch: A small "AI Pick" badge */}
            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                ✨ AI PICK
              </span> */}
            </div>
            <ProductCard product={item} onAdd={addToCart} />
          </div>
        ))}
      </div>
    </div>
  );
}
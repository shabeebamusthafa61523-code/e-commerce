import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext"
import { useWishlist } from "../../context/WishlistContext";
import { FaHeart, FaRegHeart, FaBolt } from "react-icons/fa"; // Added FaBolt
import Recommendations from "../ai/Recommendations";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-10 flex justify-center items-center font-black uppercase tracking-widest text-slate-400">Scanning Product...</div>;

  // --- PRICE LOGIC ---
  const isSale = product.isFlashSale && product.discountPrice > 0;
  const currentPrice = isSale ? product.discountPrice : product.price;
  const savings = isSale ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const toggleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] p-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Image Section */}
          {/* Image Section */}
<div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-50 p-8">
  {isSale && (
    <div className="absolute top-6 left-6 z-10 bg-red-600 text-white px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-200">
      <FaBolt /> Flash Sale
    </div>
  )}
  <img
    src={
      product.image?.startsWith("http") 
        ? product.image // If it's Cloudinary, use it directly
        : `${import.meta.env.VITE_API_BASE_URL}${product.image}` // Fallback for old local images
    }
    alt={product.name}
    className="w-full max-h-[500px] object-contain transition-transform duration-700 group-hover:scale-110"
    onError={(e) => { e.target.src = "/placeholder.png"; }} // Fallback if link is broken
  />
</div>

          {/* Details Section */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">
                  {product.category}
                </span>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">
                  Brand: {product.brand || "Organic Fresh"}
                </p>
              </div>
              <button
                onClick={toggleWishlist}
                className={`p-4 rounded-2xl transition-all ${isInWishlist(product._id) ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300 hover:text-red-400'}`}
              >
                {isInWishlist(product._id) ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              </button>
            </div>

            {/* UPDATED PRICE DISPLAY */}
            <div className="mt-8 flex items-center gap-4">
              <span className={`text-5xl font-black tracking-tighter ${isSale ? 'text-red-600' : 'text-slate-900'}`}>
                ₹{currentPrice}
              </span>
              {isSale && (
                <div className="flex flex-col">
                  <span className="text-slate-400 line-through font-bold text-lg">
                    ₹{product.price}
                  </span>
                  <span className="text-red-500 font-black text-xs uppercase tracking-widest">
                    Save {savings}% OFF
                  </span>
                </div>
              )}
            </div>

            <p className="mt-8 text-slate-500 leading-relaxed font-medium text-lg">
              {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-6">
                <span className="font-black text-xs uppercase tracking-widest text-slate-400">Quantity</span>
                <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100">
                  <button
                    onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                    className="w-10 h-10 flex items-center justify-center font-black text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm"
                  >-</button>
                  <span className="w-12 text-center font-black text-slate-900">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center font-black text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm"
                  >+</button>
                </div>
              </div>

              <button
                className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 
                  ${isSale ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'} text-white`}
                onClick={() => {
                  // We pass the "currentPrice" which is either discount or original
                  addToCart({ ...product, price: currentPrice }, qty);
                  navigate("/cart");
                }}
              >
                Add to Cart <span className="opacity-50 tracking-widest text-sm">— ₹{currentPrice * qty}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <section className="mt-24 pt-16 border-t border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">You Might Also Like</h2>
            <div className="h-1 flex-1 mx-8 bg-slate-50 rounded-full" />
          </div>
          <Recommendations 
            currentProductId={product._id} 
            category={product.category} 
          />
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
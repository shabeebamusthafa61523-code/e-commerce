import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { FaTrashAlt, FaMinus, FaPlus, FaArrowLeft, FaShieldAlt } from "react-icons/fa";

const Cart = () => {
  const { cartItems = [], removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Updated logic to handle both Cloudinary and Local legacy paths
  const getImageUrl = (item) => {
    if (!item.image) return "/placeholder.png";
    const imagePath = Array.isArray(item.image) ? item.image[0] : item.image;
    
    // If it's a full URL (Cloudinary), return it directly
    if (imagePath.startsWith("http")) return imagePath;

    // Otherwise, fallback to backend local uploads
    return `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 hover:text-emerald-600 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Shop
          </button>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Shopping Cart<span className="text-emerald-600">.</span>
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-20 text-center shadow-sm animate-in fade-in zoom-in duration-500">
            <div className="text-6xl mb-6">🛒</div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Your basket is empty</h3>
            <p className="text-slate-500 mb-10 font-medium">Looks like you haven't added any organic goodness yet.</p>
            <Link 
              to="/products" 
              className="inline-block bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:scale-105 transition-transform active:scale-95"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-lg hover:border-emerald-100"
                >
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                    className="w-32 h-32 object-contain rounded-[2rem] bg-slate-50 border-4 border-white shadow-sm"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="text-xl font-black text-slate-800 mb-1">{item.name}</h4>
                    <p className="text-emerald-600 font-black text-sm mb-4">₹{item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button
                          onClick={() => item.quantity > 1 && updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-900"
                        >
                          <FaMinus className="text-[10px]" />
                        </button>
                        <span className="w-10 text-center font-black text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-900"
                        >
                          <FaPlus className="text-[10px]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <p className="font-black text-slate-900 text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Remove Item"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl shadow-slate-300 lg:sticky lg:top-24">
              <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/60 font-medium">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60 font-medium">
                  <span>Shipping</span>
                  <span className="text-emerald-400 uppercase text-xs font-black tracking-widest">Free</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-3xl font-black text-emerald-400 tracking-tighter">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20"
              >
                Checkout Now
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-6 opacity-40">
                <FaShieldAlt className="text-xs" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Secure SSL Checkout
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
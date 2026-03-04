import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get("http://localhost:5000/api/orders/my-order", {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      setOrders(data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      fetchOrders(); 
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">History</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">My Orders</h1>
          </div>
          <p className="text-slate-500 font-medium">Total {orders.length} orders placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm">
            <span className="text-6xl mb-6 block">📦</span>
            <p className="text-slate-400 font-bold text-xl mb-6">No orders found yet.</p>
            <Link to="/products" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-200">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order._id} className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                
                {/* Order Header Bar */}
                <div className="bg-slate-50/50 px-8 py-6 flex flex-wrap justify-between items-center gap-6 border-b border-slate-50">
                  <div className="flex gap-8">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Order Ref</span>
                      <p className="font-bold text-slate-900 tracking-tight">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Date</span>
                      <p className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Amount Paid</span>
                    <p className="text-2xl font-black text-green-600 tracking-tighter">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <Link to={`/order/${order._id}`} className="block hover:bg-slate-50/30 transition-colors">
                  <div className="p-8 space-y-6">
                    {order.items.map((item, idx) => {
                      const rawImage = item.image || item.product?.image;
                      let imageUrl = "https://placehold.co/150?text=No+Image";
                      if (rawImage) {
                        const pathString = Array.isArray(rawImage) ? rawImage[0] : rawImage;
                        imageUrl = pathString.startsWith('http') 
                          ? pathString 
                          : `http://localhost:5000/uploads/${pathString.split(/[\\/]/).pop()}`;
                      }

                      return (
                        <div key={idx} className="flex items-center gap-6">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <img
                              src={imageUrl}
                              alt={item.name || "Product"}
                              className="w-full h-full object-cover rounded-2xl border border-slate-100 shadow-sm"
                            />
                            <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-slate-800 text-lg leading-tight">
                              {item.name || item.product?.name || "Premium Product"}
                            </h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                              Unit Price: ₹{item.price || item.product?.price || 0}
                            </p>
                          </div>
                          <div className="hidden md:block text-slate-300 group-hover:text-slate-900 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.1} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Link>

                {/* Footer Status Bar */}
                <div className="px-8 py-5 bg-white border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      order.orderStatus === "cancelled" ? "bg-red-500" : "bg-green-500 animate-pulse"
                    }`}></span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                      order.orderStatus === "cancelled" ? "text-red-600" : "text-slate-900"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  
                  {order.orderStatus === "processing" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-700 transition-colors border border-red-50 px-4 py-2 rounded-xl hover:bg-red-50"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
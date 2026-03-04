import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`, {
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(
        `http://localhost:5000/api/admin/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "shipped": return "bg-blue-50 text-blue-600 border-blue-100";
      case "cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="mb-12">
          <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">Logistics</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order Fulfilment</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Loading Logistics...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="bg-slate-50/50 px-8 py-6 flex flex-wrap justify-between items-center gap-6 border-b border-slate-50">
                  <div className="flex gap-10">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tracking ID</span>
                      <p className="font-mono font-bold text-slate-700 uppercase">#{order._id.slice(-8)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Customer</span>
                      <p className="font-bold text-slate-900 leading-none">{order.user?.name || "Guest"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Revenue</span>
                    <p className="text-2xl font-black text-green-600 tracking-tighter">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50/30 p-4 rounded-2xl border border-slate-50">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image || "https://placehold.co/150"} 
                          alt={item.name} 
                          className="w-14 h-14 object-cover rounded-xl" 
                        />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Qty: {item.quantity} • ₹{item.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-8 py-6 bg-white border-t border-slate-50 flex flex-wrap justify-between items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update State:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black outline-none cursor-pointer"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
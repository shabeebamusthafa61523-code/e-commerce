import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${id}`,
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <p className="text-slate-400 font-bold text-xl">Order not found</p>
      <button onClick={() => navigate("/")} className="mt-4 text-green-600 font-black uppercase text-xs tracking-widest">Return Home</button>
    </div>
  );

  const statusSteps = ["processing", "shipped", "delivered"];
  const currentStep = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* --- HEADER --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Order <span className="text-slate-400">#</span>{order._id.slice(-8).toUpperCase()}
              </h1>
            </div>
            <p className="text-slate-500 font-medium">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
              order.orderStatus === 'delivered' 
              ? "bg-green-50 text-green-700 border-green-100" 
              : "bg-blue-50 text-blue-700 border-blue-100"
            }`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* --- ORDER TRACKER --- */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10 ml-2">Shipment Progress</h2>
          
          <div className="relative flex justify-between items-start max-w-3xl mx-auto">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 z-0"></div>
            {/* Active Line */}
            <div 
              className="absolute top-5 left-0 h-[2px] bg-green-500 z-0 transition-all duration-1000"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
            ></div>

            {statusSteps.map((step, index) => (
              <div key={step} className="relative z-10 flex flex-col items-center group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-white shadow-md ${
                  index <= currentStep ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400"
                }`}>
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <p className={`text-[10px] mt-3 font-black uppercase tracking-widest transition-colors ${
                  index <= currentStep ? "text-slate-900" : "text-slate-300"
                }`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- SHIPPING + PAYMENT GRID --- */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* SHIPPING ADDRESS */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="p-2 bg-slate-50 rounded-xl text-sm">📍</span> Delivery Address
            </h2>
            <div className="space-y-1">
              <p className="text-xl font-black text-slate-900 mb-2">{order.shippingAddress?.fullName}</p>
              <div className="text-slate-500 font-medium leading-relaxed">
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-800 font-bold">
                  <span>📞</span> {order.shippingAddress?.phone}
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT INFO */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="p-2 bg-slate-50 rounded-xl text-sm">💳</span> Billing Summary
            </h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Method</p>
                <p className="font-black text-slate-800 capitalize">{order.paymentMethod}</p>
              </div>

              <div className={`p-6 rounded-[2rem] border ${
                order.isPaid ? "bg-green-50/50 border-green-100" : "bg-red-50/50 border-red-100"
              }`}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Status</p>
                {order.isPaid ? (
                  <div className="flex items-center gap-2 text-green-700 font-black">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 font-black">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Pending Payment
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- ORDERED ITEMS --- */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-slate-900 mb-8">Cart Items</h2>

          <div className="divide-y divide-slate-50">
            {order.items.map((item, idx) => {
              let imageUrl = "https://placehold.co/150?text=No+Image";
              if (item.image) {
                const pathString = Array.isArray(item.image) ? item.image[0] : item.image;
                imageUrl = pathString.startsWith("http") 
                  ? pathString 
                  : `http://localhost:5000/uploads/${pathString.split(/[\\/]/).pop()}`;
              }

              return (
                <div key={idx} className="group py-6 flex justify-between items-center transition-all">
                  <div className="flex items-center gap-6">
                    <div className="relative overflow-hidden rounded-2xl">
                       <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg">{item.name}</p>
                      <p className="text-sm font-bold text-slate-400">
                        {item.quantity} × <span className="text-slate-600">₹{item.price}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-xl font-black text-slate-900">
                    ₹{item.quantity * item.price}
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- TOTALS --- */}
          <div className="mt-10 pt-8 border-t-2 border-slate-50">
            <div className="flex justify-between items-center bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200">
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-sm font-medium text-slate-300 italic">Incl. all taxes & shipping</p>
              </div>
              <span className="text-4xl font-black">
                ₹{order.totalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
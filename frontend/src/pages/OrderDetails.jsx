import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheck, FaLeaf, FaTimes, FaDownload, FaPrint, FaArrowLeft, FaPhoneAlt, FaMapMarkerAlt  } from "react-icons/fa";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  const statusSteps = ["processing", "assigned", "picked up", "out for delivery", "delivered"];

  const fetchOrder = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${id}`,
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
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
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <p className="text-slate-400 font-bold text-xl">Order not found</p>
      <button onClick={() => navigate("/")} className="mt-4 text-emerald-600 font-black uppercase text-xs tracking-widest">Return Home</button>
    </div>
  );

  const currentStep = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-emerald-600 transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
          <button 
            onClick={() => setShowInvoice(true)}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
          >
            View Invoice
          </button>
        </div>

        {/* --- HEADER --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Order <span className="text-slate-400">#</span>{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-slate-500 font-medium">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
            order.orderStatus === 'delivered' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-blue-50 text-blue-700 border-blue-100"
          }`}>
            {order.orderStatus}
          </span>
        </div>

        {/* --- TRACKER --- */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="relative flex justify-between items-start max-w-4xl mx-auto px-4">
            <div className="absolute top-5 left-10 right-10 h-[2px] bg-slate-100 z-0"></div>
            <div 
              className="absolute top-5 left-10 h-[2px] bg-emerald-500 z-0 transition-all duration-1000"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 84}%` }}
            ></div>
            {statusSteps.map((step, index) => (
              <div key={step} className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md ${
                  index <= currentStep ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                }`}>
                  {index < currentStep ? <FaCheck size={10} /> : index + 1}
                </div>
                <p className={`text-[9px] mt-4 font-black uppercase tracking-widest max-w-[70px] ${index <= currentStep ? "text-slate-900" : "text-slate-300"}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* --- DETAILS GRID --- */}
       {/* --- DETAILS GRID --- */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* SHIPPING ADDRESS SECTION - FIXED KEY MAPPING */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FaMapMarkerAlt className="text-emerald-500" /> Delivery Address
            </h2>
            <div className="space-y-1">
              <p className="text-xl font-black text-slate-900 mb-2">{order.shippingAddress?.fullName || "Name Not Specified"}</p>
              <div className="text-slate-500 font-medium leading-relaxed">
                {/* Check for 'street' first, fallback to 'address' if that was used previously */}
                <p className="text-slate-800 font-bold">{order.shippingAddress?.street || order.shippingAddress?.address || "Address detail missing"}</p>
                <p>{order.shippingAddress?.city}{order.shippingAddress?.pincode ? `, ${order.shippingAddress.pincode}` : ""}</p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-900 font-bold">
                  <FaPhoneAlt className="text-emerald-500 size-3" /> {order.shippingAddress?.phone || "Phone not provided"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">💳 Billing Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Method</span>
                <span className="font-black text-slate-800 uppercase tracking-tighter">{order.paymentMethod}</span>
              </div>
              <div className={`p-4 rounded-2xl border ${order.isPaid ? "bg-emerald-50/50 border-emerald-100 text-emerald-700" : "bg-red-50/50 border-red-100 text-red-600"} font-black text-sm text-center`}>
                {order.isPaid ? `PAID AT ${new Date(order.paidAt).toLocaleTimeString()}` : "PAYMENT PENDING"}
              </div>
            </div>
          </div>
        </div>

        {/* --- CART ITEMS --- */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
          <div className="divide-y divide-slate-50">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-6 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <img 
                    src={item.image?.startsWith("http") ? item.image : `${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                    alt={item.name} className="w-16 h-16 object-contain bg-slate-50 rounded-xl"
                  />
                  <div>
                    <p className="font-black text-slate-900">{item.name}</p>
                    <p className="text-xs font-bold text-slate-400">{item.quantity} × ₹{item.price}</p>
                  </div>
                </div>
                <p className="font-black text-slate-900">₹{item.quantity * item.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-slate-900 text-white p-8 rounded-[2.5rem] flex justify-between items-center">
            <span className="text-emerald-400 font-black text-2xl">Total</span>
            <span className="text-3xl font-black">₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* --- INVOICE MODAL --- */}
      {showInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            <div className="absolute top-6 right-8 flex gap-3 print:hidden">
              <button onClick={() => window.print()} className="p-3 bg-slate-100 hover:bg-emerald-100 text-slate-600 rounded-full transition-colors"><FaPrint size={14}/></button>
              <button onClick={() => setShowInvoice(false)} className="p-3 bg-slate-100 hover:bg-red-100 text-slate-600 rounded-full transition-colors"><FaTimes size={14}/></button>
            </div>
            <div className="p-12">
              <div className="flex justify-between mb-10">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 mb-1"><FaLeaf size={20}/><span className="text-xl font-black text-slate-900">PACHA.CART</span></div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Official Tax Invoice</p>
                </div>
                <div className="text-right"><p className="text-xs font-black text-slate-900 uppercase">Inv-#{order._id.slice(-6).toUpperCase()}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-100">
                <div className="text-xs"><p className="font-black text-emerald-600 uppercase mb-2">Customer</p><p className="font-black text-slate-800">{order.shippingAddress?.fullName}</p><p className="text-slate-500">{order.shippingAddress?.street}</p></div>
                <div className="text-right text-xs"><p className="font-black text-emerald-600 uppercase mb-2">Order Date</p><p className="font-black text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</p></div>
              </div>
              <table className="w-full mb-8 text-xs">
                <thead className="text-slate-400 uppercase font-black border-b border-slate-50"><tr className="text-left"><th className="pb-3">Item</th><th className="pb-3 text-center">Qty</th><th className="pb-3 text-right">Total</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items.map((item, i) => (
                    <tr key={i}><td className="py-3 font-bold text-slate-800">{item.name}</td><td className="py-3 text-center text-slate-500">{item.quantity}</td><td className="py-3 text-right font-black">₹{item.quantity * item.price}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center"><p className="text-[10px] font-black text-slate-400 uppercase">Grand Total</p><p className="text-2xl font-black text-slate-900">₹{order.totalAmount.toFixed(2)}</p></div>
              <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] mt-10">Premium Organic Groceries</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
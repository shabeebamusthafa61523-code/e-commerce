import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMarketplaceOrders,
  fetchMyOrders,
  assignOrder,
  updateOrderStatus,
} from "../../features/delivery/DeliverySlice";
import { 
  Package, MapPin, ArrowRight, Zap, 
  Loader2, ShoppingBag, Bell, FaRupeeSign, CheckCircle, Navigation, Phone, IndianRupee
} from "lucide-react";
import { toast } from "react-hot-toast";

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const [subTab, setSubTab] = useState("marketplace");
  const [isOnline, setIsOnline] = useState(true);

  const { marketplaceOrders = [], myOrders = [], loading } = useSelector(
    (state) => state.delivery
  );
  const { userInfo } = useSelector((state) => state.auth);

  // Stats Logic
  const completedToday = myOrders.filter(o => o.orderStatus === 'delivered').length;
  const earningsToday = myOrders
    .filter(o => o.orderStatus === 'delivered')
    .reduce((acc, curr) => acc + (curr.totalAmount * 0.1), 0);

  useEffect(() => {
    if (isOnline) {
      dispatch(fetchMarketplaceOrders());
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isOnline]);

  // HANDLE CLAIM ORDER (Optimized)
  const handleAccept = async (orderId) => {
    const loadingToast = toast.loading("Claiming order...");
    const result = await dispatch(assignOrder({ orderId, partnerId: userInfo._id }));
    
    if (!result.error) {
      toast.success("Order Claimed!", { id: loadingToast });
      // Background refresh to sync lists without page reload
      dispatch(fetchMarketplaceOrders());
      dispatch(fetchMyOrders());
      setSubTab("tasks");
    } else {
      toast.error("Failed to claim order", { id: loadingToast });
    }
  };

  // HANDLE STATUS UPDATE (Optimized)
  const handleStatusUpdate = async (orderId, currentStatus) => {
    const statusFlow = {
      'placed': 'picked up',
      'processing': 'picked up',
      'picked up': 'out for delivery',
      'out for delivery': 'delivered'
    };

    const nextStatus = statusFlow[currentStatus];

    if (nextStatus) {
      const loadingToast = toast.loading(`Updating to ${nextStatus}...`);
      const result = await dispatch(updateOrderStatus({ orderId, status: nextStatus }));
      
      if (!result.error) {
        toast.success(`Status: ${nextStatus.toUpperCase()}`, { id: loadingToast });
        // Refresh local data from server to update UI state
        dispatch(fetchMyOrders());
      } else {
        toast.error("Update failed", { id: loadingToast });
      }
    }
  };

  const getImageUrl = (item) => {
    const path = item.product?.image || item.image;
    if (!path) return "https://placehold.co/150?text=No+Image";
    return path.startsWith("http") 
      ? path 
      : `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="size-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><IndianRupee size={20} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today's Earnings</p>
            <p className="text-xl font-black text-slate-900">₹{earningsToday.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="size-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><CheckCircle size={20} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</p>
            <p className="text-xl font-black text-slate-900">{completedToday} Drops</p>
          </div>
        </div>
        <div className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${isOnline ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`size-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-white' : 'text-slate-400'}`}>
              {isOnline ? 'System Online' : 'System Offline'}
            </span>
          </div>
          <button onClick={() => setIsOnline(!isOnline)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${isOnline ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500 text-white'}`}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* 2. HEADER & TABS */}
      <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Terminal<span className="text-emerald-500">.</span></h1>
        <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-[22px] border border-slate-100">
          <button onClick={() => setSubTab("marketplace")} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${subTab === "marketplace" ? "bg-white text-slate-900 shadow-md" : "text-slate-500"}`}>Market ({marketplaceOrders.length})</button>
          <button onClick={() => setSubTab("tasks")} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${subTab === "tasks" ? "bg-white text-slate-900 shadow-md" : "text-slate-500"}`}>Tasks ({myOrders.length})</button>
        </div>
      </header>

      {/* 3. ORDER GRID */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(subTab === "marketplace" ? marketplaceOrders : myOrders).map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase italic">
                  {order.orderStatus}
                </span>
                <p className="font-mono font-bold text-slate-400 text-xs">#{order._id.slice(-6).toUpperCase()}</p>
              </div>

              {/* PRODUCT MANIFEST */}
              <div className="flex-1 mb-6">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                  <ShoppingBag size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Manifest ({order.items?.length})</span>
                </div>
                
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                      <img 
                        src={getImageUrl(item)} 
                        className="w-10 h-10 object-contain bg-white rounded-xl border border-slate-200 p-1"
                        alt=""
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[11px] font-bold text-slate-800 truncate">
                          {item.product?.name || item.name || "Item"}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-[9px] font-black text-emerald-600 uppercase">Qty: {item.quantity}</p>
                          <p className="text-[9px] font-bold text-slate-400 italic">₹{item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DESTINATION */}
              <div className="mb-6 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-emerald-500" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-900">{order.shippingAddress?.fullName}</p>
                  <p className="text-[11px] font-bold text-slate-600 leading-tight">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    PIN: {order.shippingAddress?.pincode} | Ph: {order.shippingAddress?.phone}
                  </p>
                </div>
              </div>

              {/* TOTAL & PAYMENT */}
              <div className="flex items-center justify-between mb-6 px-2">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
                  <p className="text-[10px] font-bold text-slate-900 uppercase italic">{order.paymentMethod || 'Prepaid'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Collect</p>
                  <p className="text-xl font-black text-emerald-600 flex items-center justify-end">
                    <IndianRupee size={16} strokeWidth={3} />
                    {order.totalAmount?.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              {subTab === "marketplace" ? (
                <button 
                  onClick={() => handleAccept(order._id)} 
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
                >
                  Claim Order <ArrowRight size={14} />
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <a href={`tel:${order.shippingAddress?.phone}`} className="p-4 bg-slate-100 text-slate-900 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all">
                      <Phone size={16} />
                    </a>
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.pincode}`)}`)}
                      className="flex-1 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200"
                    >
                      <Navigation size={14} /> Navigate
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleStatusUpdate(order._id, order.orderStatus)}
                    disabled={order.orderStatus === 'delivered'}
                    className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all ${
                      order.orderStatus === 'delivered' 
                      ? 'bg-emerald-100 text-emerald-600 cursor-default' 
                      : 'bg-emerald-600 text-white hover:bg-slate-900'
                    }`}
                  >
                    {order.orderStatus === 'placed' || order.orderStatus === 'processing' 
                      ? "Confirm Pickup" 
                      : order.orderStatus === 'picked up' 
                      ? "Start Delivery" 
                      : order.orderStatus === 'out for delivery' 
                      ? "Mark as Delivered" 
                      : "Order Completed"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
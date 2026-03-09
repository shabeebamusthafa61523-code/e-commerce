import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import { 
  Package, IndianRupee, TrendingUp, Calendar, 
  MapPin, CheckCircle, Clock, ShoppingBag 
} from 'lucide-react';

const DeliveryHistory = () => {
  const { myOrders = [] } = useSelector((state) => state.delivery);

  // 1. Filter only completed tasks for the archive
  const completedOrders = useMemo(() => 
    (myOrders || []).filter(order => order.orderStatus === 'delivered'),
    [myOrders]
  );
  
  // 2. Lifetime Performance Stats
  const stats = useMemo(() => {
    const total = completedOrders.length;
    const earnings = completedOrders.reduce((sum, order) => sum + (order.totalAmount * 0.1 || 0), 0);
    return { total, earnings };
  }, [completedOrders]);

  const getImageUrl = (item) => {
    const path = item.product?.image || item.image;
    if (!path) return "https://placehold.co/150?text=No+Image";
    return path.startsWith("http") 
      ? path 
      : `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. STATS SECTION (Visual mirror of Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 group">
          <div className="size-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600">
            <Package size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Drops</p>
            <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-100 flex items-center gap-5 relative overflow-hidden">
          <div className="size-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center text-white z-10">
            <IndianRupee size={28} />
          </div>
          <div className="z-10">
            <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Total Payout (10%)</p>
            <p className="text-3xl font-black text-white">₹{stats.earnings.toLocaleString()}</p>
          </div>
          <TrendingUp size={100} className="absolute -right-4 -bottom-4 text-white/10" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm border-l-4 border-l-blue-500 flex items-center gap-5">
          <div className="size-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-emerald-500">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Efficiency</p>
            <p className="text-3xl font-black text-slate-900">100%</p>
          </div>
        </div>
      </div>

      {/* 2. HEADER */}
      <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
            Mission <span className="text-emerald-500">History.</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">
            Archived Records & Verified Payouts
          </p>
        </div>
        <div className="px-6 py-2.5 bg-slate-200/50 rounded-[18px] text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">
          Completed ({completedOrders.length})
        </div>
      </header>

      {/* 3. ORDER GRID */}
      {completedOrders.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {completedOrders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all flex flex-col h-full group">
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase italic flex items-center gap-1">
                  <CheckCircle size={8} /> Delivered
                </span>
                <p className="font-mono font-bold text-slate-400 text-xs">#{order._id.slice(-6).toUpperCase()}</p>
              </div>

              {/* MANIFEST SECTION */}
              <div className="flex-1 mb-6">
                <div className="flex items-center gap-2 mb-3 text-slate-400">
                  <ShoppingBag size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Items Delivered</span>
                </div>
                
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                      <img 
                        src={getImageUrl(item)} 
                        className="w-10 h-10 object-contain bg-white rounded-xl border border-slate-200 p-1 grayscale group-hover:grayscale-0 transition-all"
                        alt=""
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[11px] font-bold text-slate-800 truncate">{item.product?.name || item.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DESTINATION SUMMARY */}
              <div className="mb-6 bg-slate-50/30 p-4 rounded-3xl border border-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-slate-300" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dropped At</p>
                </div>
                <p className="text-xs font-black text-slate-900 mb-1 uppercase">{order.shippingAddress?.fullName}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{order.shippingAddress?.city}</p>
                  <p className="text-[9px] font-black text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> 
                    {new Date(order.deliveredAt || order.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              </div>

              {/* EARNINGS BADGE (Finalized Payout) */}
              <div className="bg-slate-900 text-white p-5 rounded-3xl flex justify-between items-center group-hover:bg-emerald-600 transition-colors">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Payout Issued</p>
                  <p className="text-xl font-black tracking-tighter italic">₹{(order.totalAmount * 0.1).toFixed(0)}</p>
                </div>
                <div className="size-10 bg-white/10 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={18} />
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-[3rem] py-32 flex flex-col items-center justify-center bg-white/50">
          <div className="size-20 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6">
            <Package size={32} className="text-slate-200" />
          </div>
          <p className="text-slate-400 font-black uppercase text-xs tracking-[0.4em] italic text-center">
            No history detected.<br/>Completed drops will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;
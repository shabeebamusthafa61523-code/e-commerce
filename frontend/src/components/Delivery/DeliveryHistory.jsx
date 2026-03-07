import React from 'react';
import { Package, IndianRupee, TrendingUp, Calendar, MapPin, CheckCircle } from 'lucide-react';

const DeliveryHistory = ({ orders = [] }) => {
  // 1. Calculate Dynamic Stats
  const totalDelivered = (orders || []).length;
  const totalEarnings = (orders || []).reduce(
    (sum, order) => sum + (order.totalAmount * 0.1 || 0),
    0
  );

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50 animate-fadeIn">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
            Fleet History<span className="text-emerald-500">.</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">
            Performance & Completed Earnings
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm w-fit">
          <Calendar size={14} className="text-slate-400" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Lifetime Records</span>
        </div>
      </header>
      
      {/* Performance Summary Cards - Matching Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm group">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Deliveries</p>
          <div className="flex items-end gap-3">
            <h4 className="text-5xl font-black text-slate-900">{totalDelivered}</h4>
            <Package size={24} className="text-slate-200 mb-2" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm group">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Net Payout (10%)</p>
          <div className="flex items-end gap-3">
            <h4 className="text-5xl font-black text-emerald-600">₹{totalEarnings.toLocaleString()}</h4>
            <IndianRupee size={24} className="text-emerald-200 mb-2" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm group hidden md:block border-l-4 border-l-blue-500">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Efficiency Rate</p>
          <div className="flex items-end gap-3">
            <h4 className="text-5xl font-black text-blue-600">99%</h4>
            <TrendingUp size={24} className="text-blue-100 mb-2" />
          </div>
        </div>
      </div>

      {/* History Log - Card Layout instead of Table */}
      <div className="space-y-4">
        <h5 className="text-slate-400 text-[10px] uppercase font-black tracking-widest px-2 mb-4">Completed Logs</h5>
        
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white border border-slate-100 p-6 rounded-[28px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="size-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <span className="text-[10px] font-black uppercase leading-none opacity-40">Ref</span>
                    <span className="text-xs font-black uppercase tracking-tighter">#{order._id.slice(-4).toUpperCase()}</span>
                  </div>
                  
                  <div>
                    <p className="text-slate-900 font-black text-lg leading-tight">
                      {order.shippingAddress?.fullName || "Guest Customer"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={12} className="text-slate-300" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {order.shippingAddress?.city || "Local Delivery"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Completion</p>
                    <p className="text-sm font-bold text-slate-700">
                      {order.deliveredAt 
                        ? new Date(order.deliveredAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })
                        : "Processed"
                      }
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Payout</p>
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-xl font-black text-slate-900">₹{(order.totalAmount * 0.1).toFixed(0)}</span>
                      <CheckCircle size={14} className="text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-[3rem] py-24 flex flex-col items-center justify-center bg-white/50">
             <Package size={48} className="text-slate-200 mb-4" />
             <p className="text-slate-400 font-black uppercase text-sm tracking-widest">No history detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
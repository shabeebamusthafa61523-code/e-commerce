import React from 'react';

const DeliveryHistory = ({ orders = [] }) => {
  // 1. Calculate Dynamic Stats
  const totalDelivered = orders.length;
  const totalEarnings = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="animate-fadeIn">
      <header className="mb-10">
        <h2 className="text-4xl font-black text-white tracking-tighter">Fleet History</h2>
        <p className="text-gray-500 uppercase text-[10px] tracking-[0.3em] font-bold mt-1">
          Performance & Completed Earnings
        </p>
      </header>
      
      {/* Dynamic Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[32px] hover:border-emerald-500/30 transition-all">
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Deliveries</p>
          <h4 className="text-5xl font-black text-white">{totalDelivered}</h4>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[32px] hover:border-emerald-500/30 transition-all">
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">Total Earnings</p>
          <h4 className="text-5xl font-black text-emerald-400">₹{totalEarnings.toLocaleString()}</h4>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[32px] hover:border-emerald-500/30 transition-all hidden md:block">
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">On-Time</p>
          <h4 className="text-5xl font-black text-blue-400">99%</h4>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#111] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-gray-500 uppercase text-[10px] tracking-widest font-black border-b border-white/5">
              <tr>
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Delivered At</th>
                <th className="px-8 py-6 text-right">Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6 font-mono text-xs text-gray-500 group-hover:text-white transition-colors">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-white font-bold">
                        {order.shippingAddress?.fullName || "Guest Customer"}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                        {order.shippingAddress?.city || "Local"}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-gray-400 text-sm">
                      {order.deliveredAt 
                        ? new Date(order.deliveredAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })
                        : "Date Unavailable"
                      }
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-emerald-400 font-black text-lg">₹{order.totalAmount}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-gray-500 font-medium italic">
                    No history records found in this cycle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistory;
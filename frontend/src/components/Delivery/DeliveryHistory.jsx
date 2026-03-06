import React from 'react';

const DeliveryHistory = ({ orders }) => {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-white mb-6">Delivery History</h2>
      
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
          <p className="text-gray-400 text-sm">Total Delivered</p>
          <h4 className="text-4xl font-bold text-emerald-400">128</h4>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
          <p className="text-gray-400 text-sm">On-Time Rate</p>
          <h4 className="text-4xl font-bold text-blue-400">98%</h4>
        </div>
      </div>

      {/* History Table/List */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-gray-300">#{order._id.slice(-6)}</td>
                <td className="px-6 py-4 text-white font-medium">{order.shippingAddress.fullName}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(order.deliveredAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right text-emerald-400 font-bold">₹{order.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DeliveryHistory;
const AdminAssignRow = ({ order, partners, onAssign }) => {
  if (!order) return <div className="p-4 text-gray-500 italic">Loading order data...</div>;

  return (
    <div className="flex items-center gap-4 p-5 bg-white/5 border-b border-white/5 hover:bg-white/[0.07] transition-all">
      <div className="flex-1">
        <p className="text-white font-semibold">{order.shippingAddress.fullName}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
          {order.items.length} items • <span className="text-emerald-400">₹{order.totalAmount}</span>
        </p>
      </div>

      <div className="relative">
        <select 
          onChange={(e) => onAssign(order._id, e.target.value)}
          className={`appearance-none bg-[#1a1a1a] text-white text-xs rounded-2xl border border-white/10 focus:ring-2 focus:ring-emerald-500 p-3 pr-10 cursor-pointer transition-all ${
            order.deliveryPartner ? 'border-emerald-500/50 text-emerald-400' : ''
          }`}
          defaultValue={order.deliveryPartner || ""}
        >
          <option value="" disabled>Select Rider</option>
          {partners.filter(p => p.isAvailable).map(p => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
        {/* Custom Arrow for select */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
      </div>
    </div>
  );
};
export default AdminAssignRow;
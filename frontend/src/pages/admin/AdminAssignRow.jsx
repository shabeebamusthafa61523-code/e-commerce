import React from 'react';
import { MapPin, Clock, PackageCheck } from 'lucide-react';

// Added = [] as a default value to prevent the .filter() undefined error
const AdminAssignRow = ({ order, partners = [], onAssign }) => {
  const customerName = order?.shippingAddress?.fullName || "Guest Customer";
  const city = order?.shippingAddress?.city || "Local Area";
  
  // Safely filter partners now that we have a default empty array
  const availablePartners = partners.filter(p => p.isAvailable || p._id === order.deliveryPartner);

  if (!order) return null;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-white/[0.02] border-b border-white/5 hover:bg-white/[0.05] transition-all group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-white font-bold truncate">{customerName}</p>
          {order.deliveryPartner && (
            <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
              <PackageCheck size={10} /> Assigned
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-gray-500 text-[11px] font-medium">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-gray-600" /> {city}
          </span>
          <span className="text-emerald-500/80 font-bold tracking-tight">
            ₹{order.totalAmount}
          </span>
        </div>
      </div>

      <div className="relative w-full md:w-64">
        <select 
          onChange={(e) => onAssign(order._id, e.target.value)}
          className={`w-full appearance-none bg-black/40 text-xs font-bold rounded-2xl border p-4 pr-10 cursor-pointer transition-all outline-none ${
            order.deliveryPartner 
              ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' 
              : 'border-white/10 text-gray-400 hover:border-white/20'
          }`}
          value={order.deliveryPartner || ""}
        >
          <option value="" disabled>Dispatch to Rider...</option>
          {availablePartners.map(p => (
            <option key={p._id} value={p._id} className="bg-[#1a1a1a] text-white">
              {p.name}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
           <Clock size={14} />
        </div>
      </div>
    </div>
  );
};

export default AdminAssignRow;
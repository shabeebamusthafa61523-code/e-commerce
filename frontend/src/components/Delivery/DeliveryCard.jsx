import React from 'react';
import { MapPin, Phone, Navigation, ShoppingBag, ArrowRight, IndianRupee } from 'lucide-react';

const DeliveryCard = ({ order, onRefresh, onAccept, isMarketplace }) => {
  const productList = order.items || [];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/150?text=Pacha+Cart";
    return imagePath.startsWith("http") 
      ? imagePath 
      : `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
  };

  return (
    <div className="bg-white p-6 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all flex flex-col h-full">
      {/* 1. Header & Status */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-tighter">
          {order.orderStatus}
        </span>
        <h3 className="font-black text-slate-900 text-lg italic">#{order._id.slice(-6).toUpperCase()}</h3>
      </div>

      {/* 2. Product Manifest */}
      <div className="flex-1 mb-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <ShoppingBag size={12} /> Manifest ({productList.length})
        </p>
        <div className="space-y-3">
          {productList.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <img 
                src={getImageUrl(item.product?.image || item.image)} 
                className="w-10 h-10 object-contain bg-white rounded-xl border border-slate-200 p-1"
                alt={item.product?.name || item.name}
              />
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-bold text-slate-800 truncate">
                  {item.product?.name || item.name || "Grocery Item"}
                </p>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-[9px] font-black text-emerald-600 uppercase">Qty: {item.quantity}</p>
                  <p className="text-[10px] font-bold text-slate-400">₹{item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Full Address Section */}
      <div className="mb-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={14} className="text-emerald-500" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Destination</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black text-slate-900">{order.shippingAddress?.fullName || order.shippingAddress?.name}</p>
          <p className="text-[11px] font-bold text-slate-600 leading-tight">
            {order.shippingAddress?.street}, {order.shippingAddress?.city}
          </p>
          <p className="text-[11px] font-bold text-slate-500">
            PIN: {order.shippingAddress?.pincode} | Ph: {order.shippingAddress?.phone}
          </p>
        </div>
      </div>

      {/* 4. Price & Payment Summary */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Mode</p>
          <p className="text-[10px] font-bold text-slate-900 uppercase">{order.paymentMethod || 'Online'}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bill</p>
          <p className="text-xl font-black text-emerald-600 flex items-center justify-end">
            <IndianRupee size={16} strokeWidth={3} />
            {order.totalAmount?.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 5. Action Buttons */}
      {isMarketplace ? (
        <button 
          onClick={onAccept}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200"
        >
          Claim Order <ArrowRight size={14} />
        </button>
      ) : (
        <div className="flex gap-2">
           <a href={`tel:${order.shippingAddress?.phone}`} className="p-4 bg-slate-100 text-slate-900 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all">
             <Phone size={16} />
           </a>
           <button 
             onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.pincode}`)}`)}
             className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
           >
             <Navigation size={14} /> Open Navigator
           </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryCard;
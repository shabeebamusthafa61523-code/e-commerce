import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const DeliveryCard = ({ order, onRefresh }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (newStatus) => {
    try {
      setIsUpdating(true);
      // Ensure you're sending the right status string to match your backend logic
const userInfo = JSON.parse(localStorage.getItem("userInfo"));

await axios.put(
  `/api/orders/${order._id}/status`,
  { status: newStatus },
  {
    headers: {
      Authorization: `Bearer ${userInfo.token}`
    }
  }
);      
      toast.success(`Order ${newStatus}!`);
      
      // Trigger a refresh in the parent component
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-xl transition-all hover:bg-white/[0.08]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
            #{order._id?.slice(-6)}
          </span>
          <h3 className="text-xl font-bold mt-3 text-white">
            {order.shippingAddress?.city || "Local Delivery"}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Target Time</p>
          <p className="text-white font-mono font-bold">24:59</p>
        </div>
      </div>
      
      <div className="bg-white/[0.03] p-4 rounded-2xl mb-6 border border-white/5">
        <p className="text-xs text-gray-500 uppercase font-black mb-1">Deliver to</p>
        <p className="text-white font-bold">{order.shippingAddress?.fullName || "Guest Customer"}</p>
        <p className="text-sm text-gray-400">
          {order.shippingAddress?.street ? `${order.shippingAddress.street}, ` : ""}
          {order.shippingAddress?.city || "Address not specified"}
        </p>
      </div>

      <div className="space-y-3">
        {order.orderStatus === 'assigned' && (
          <button 
            disabled={isUpdating}
            onClick={() => updateStatus('picked_up')} 
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50"
          >
            {isUpdating ? 'Processing...' : 'Confirm Pickup'}
          </button>
        )}
        
        {order.orderStatus === 'picked_up' && (
          <button 
            disabled={isUpdating}
            onClick={() => updateStatus('delivered')} 
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50"
          >
            {isUpdating ? 'Finishing...' : 'Mark as Delivered'}
          </button>
        )}

        {order.orderStatus === 'delivered' && (
          <div className="w-full bg-white/10 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-center">
            Successfully Delivered
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryCard;
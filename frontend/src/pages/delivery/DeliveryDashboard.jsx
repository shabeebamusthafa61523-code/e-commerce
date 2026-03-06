import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyDeliveries, updateOrderStatus } from '../../features/delivery/DeliverySlice';
import { toast } from 'react-hot-toast';

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const { myOrders = [], loading } = useSelector((state) => state.delivery || {});
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    dispatch(fetchMyDeliveries());
  }, [dispatch]);

  const handleStatusUpdate = (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'Assigned' ? 'Picked Up' : 'Delivered';
    dispatch(updateOrderStatus({ orderId, status: nextStatus }))
      .then(() => toast.success(`Order marked as ${nextStatus}`));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Rider: {userInfo?.name}</h1>
        <p className="text-gray-400">Current Assignments</p>
      </header>

      {loading ? (
        <div className="animate-pulse text-emerald-500">Loading your route...</div>
      ) : (
        <div className="space-y-6">
          {myOrders.length === 0 ? (
            <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center text-gray-500">
              No active deliveries right now.
            </div>
          ) : (
            myOrders.map((order) => (
              <div key={order._id} className="bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Order ID: {order._id.slice(-6)}</span>
                    <h3 className="text-xl font-bold">{order.shippingAddress.city}</h3>
                    <p className="text-sm text-gray-400">{order.shippingAddress.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400">₹{order.totalAmount}</p>
                    <p className="text-xs text-gray-500">{order.orderStatus}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleStatusUpdate(order._id, order.orderStatus)}
                  disabled={order.orderStatus === 'Delivered'}
                  className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                    order.orderStatus === 'Delivered' 
                    ? 'bg-gray-800 text-gray-500' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {order.orderStatus === 'Assigned' ? 'Confirm Pickup' : 
                   order.orderStatus === 'Picked Up' ? 'Mark as Delivered' : 'Completed'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
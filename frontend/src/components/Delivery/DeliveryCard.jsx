
const DeliveryCard = ({ order }) => {
  const updateStatus = async (newStatus) => {
    await axios.put(`/api/orders/${order._id}/status`, { status: newStatus });
    // Refresh orders list here
  };

  return (
    <div className="premium-glass-card">
      <div className="card-top">
        <h3>Order #{order._id.slice(-6)}</h3>
        <p className="timer">Target: 30 mins</p>
      </div>
      
      <div className="address-box">
        <p><strong>Deliver to:</strong> {order.shippingAddress.fullName}</p>
        <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
      </div>

      <div className="action-buttons">
        {order.orderStatus === 'assigned' && (
          <button onClick={() => updateStatus('picked up')} className="btn-pickup">
            Confirm Pickup
          </button>
        )}
        {order.orderStatus === 'picked up' && (
          <button onClick={() => updateStatus('delivered')} className="btn-delivered">
            Mark as Delivered
          </button>
        )}
      </div>
    </div>
  );
};
export default DeliveryCard;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminSidebar from "../../components/admin/AdminSidebar";
import { fetchPartners, assignOrder } from '../../features/delivery/DeliverySlice';
import { 
  FaBoxOpen, FaMapMarkerAlt, FaRoute, FaCheckCircle, 
  FaChevronRight, FaPhoneAlt, FaUser, FaExternalLinkAlt 
} from 'react-icons/fa';

const DeliveryManagement = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('pending'); // 'pending', 'active', or 'completed'

  const { partners = [] } = useSelector((state) => state.delivery || {});

  const fetchAllOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      setOrders(data || []);
    } catch (error) {
      console.error("Logistics Fetch Error:", error);
      toast.error("Failed to sync with terminal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
    dispatch(fetchPartners());
  }, [dispatch]);

  // --- FILTERS ---
  const unassignedOrders = orders?.filter(o => 
    !o.deliveryPartner && ['processing', 'placed'].includes(o.orderStatus)
  ) || [];
  
  const activeShipments = orders?.filter(o => 
    o.deliveryPartner && !['delivered', 'cancelled'].includes(o.orderStatus)
  ) || [];

  const completedOrders = orders?.filter(o => 
    o.orderStatus === 'delivered'
  ) || [];

  const handleAssign = (orderId, partnerId) => {
    dispatch(assignOrder({ orderId, partnerId })).then((res) => {
      if (!res.error) {
        toast.success("Rider Dispatched Successfully");
        fetchAllOrders();
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">Fleet Operations</span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
              Logistics <span className="text-emerald-500">Hub</span>
            </h1>
          </div>

          <div className="flex bg-white p-1.5 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            {[
              { id: 'pending', label: 'Pending', count: unassignedOrders.length, color: 'bg-slate-900' },
              { id: 'active', label: 'Active', count: activeShipments.length, color: 'bg-emerald-500' },
              { id: 'completed', label: 'Completed', count: completedOrders.length, color: 'bg-blue-600' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  view === tab.id ? `${tab.color} text-white shadow-lg` : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            
            {/* 1. PENDING VIEW */}
            {view === 'pending' && (
              <div className="divide-y divide-slate-50">
                {unassignedOrders.length > 0 ? unassignedOrders.map(order => (
                  <div key={order._id} className="p-8 hover:bg-slate-50/50 transition-all flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="size-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400"><FaBoxOpen size={24} /></div>
                      <div>
                        <p className="text-sm font-black text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                        <ProductManifest items={order.items} />
                        <div className="flex items-center gap-2 mt-2 text-slate-400">
                          <FaMapMarkerAlt size={10} />
                          <p className="text-[10px] font-bold uppercase italic">{order.shippingAddress?.city}</p>
                        </div>
                      </div>
                    </div>
                    <select 
                      className="bg-slate-900 text-white text-[11px] font-black px-6 py-3 rounded-xl outline-none hover:bg-emerald-600 transition-colors cursor-pointer"
                      onChange={(e) => handleAssign(order._id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Dispatch Rider</option>
                      {partners.filter(p => p.isAvailable).map(partner => (
                        <option key={partner._id} value={partner._id}>{partner.name}</option>
                      ))}
                    </select>
                  </div>
                )) : <EmptyState message="All orders dispatched" />}
              </div>
            )}

            {/* 2. ACTIVE & COMPLETED TABLE VIEW */}
            {(view === 'active' || view === 'completed') && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order & Manifest</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Rider</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Full Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(view === 'active' ? activeShipments : completedOrders).map(order => (
                      <tr key={order._id} className="hover:bg-slate-50/30 transition-all group">
                        <td className="px-10 py-8">
                          <p className="text-sm font-black text-slate-900 mb-2">#{order._id.slice(-8).toUpperCase()}</p>
                          <ProductManifest items={order.items} />
                        </td>
                        
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white ${view === 'completed' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                              {order.deliveryPartner?.name?.charAt(0) || 'R'}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-slate-900 uppercase">
                                {order.deliveryPartner?.name || "Unassigned"}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 lowercase italic">
                                {order.deliveryPartner?.email || "partner@pachacart.com"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-10 py-8"><StatusBadge status={order.orderStatus} /></td>

                        <td className="px-10 py-8">
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2 min-w-[200px]">
                            {/* Customer & Phone */}
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-1">
                               <div className="flex items-center gap-1.5">
                                 <FaUser size={9} className="text-slate-400" />
                                 <span className="text-[10px] font-black text-slate-900 uppercase truncate max-w-[100px]">
                                   {order.shippingAddress?.fullName}
                                 </span>
                               </div>
                               <div className="flex items-center gap-1 text-emerald-600">
                                 <FaPhoneAlt size={8} />
                                 <span className="text-[9px] font-mono font-bold tracking-tighter">
                                   {order.shippingAddress?.phone}
                                 </span>
                               </div>
                            </div>

                            {/* Street & PIN */}
                            <div className="flex items-start gap-2">
                               <FaMapMarkerAlt size={11} className="text-emerald-500 mt-0.5" />
                               <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-slate-600 leading-tight uppercase">
                                   {order.shippingAddress?.street}, {order.shippingAddress?.city}
                                 </span>
                                 <div className="flex items-center justify-between mt-1">
                                    <span className="text-[8px] font-black text-slate-400 tracking-widest">
                                      PIN: {order.shippingAddress?.pincode}
                                    </span>
                                    <button 
                                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${order.shippingAddress?.street}, ${order.shippingAddress?.city}, ${order.shippingAddress?.pincode}`)}`)}
                                      className="flex items-center gap-1 text-[8px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                      Maps <FaExternalLinkAlt size={7} />
                                    </button>
                                 </div>
                               </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(view === 'active' ? activeShipments : completedOrders).length === 0 && (
                  <EmptyState message={view === 'active' ? "No live deliveries" : "No completed orders yet"} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ProductManifest = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items?.map((item, idx) => (
      <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-600 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
        {item.quantity}x {item.product?.name || item.name}
      </span>
    ))}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    "picked up": "bg-purple-50 text-purple-600 border-purple-100",
    "out for delivery": "bg-amber-50 text-amber-600 border-amber-100",
    "delivered": "bg-blue-50 text-blue-600 border-blue-100",
    "assigned": "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${styles[status] || 'bg-slate-50 text-slate-500'}`}>
      <div className={`size-1.5 rounded-full bg-current ${status !== 'delivered' && 'animate-pulse'}`} />
      <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="py-24 text-center">
    <div className="size-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
      <FaRoute className="text-slate-200" size={30} />
    </div>
    <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">{message}</p>
  </div>
);

export default DeliveryManagement;
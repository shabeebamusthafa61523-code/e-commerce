import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminAssignRow from './AdminAssignRow';
import { 
  fetchPartners, 
  toggleAvailability, 
  registerPartner, 
  assignOrder 
} from '../../features/delivery/DeliverySlice';
import { toast } from 'react-hot-toast';

const DeliveryManagement = ({ orders = [] }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: 'password123' });

  const { partners = [], loading } = useSelector((state) => state.delivery || {});

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const handleToggle = (id, currentStatus) => {
    dispatch(toggleAvailability({ id, isAvailable: !currentStatus }));
  };

  const handleAddPartner = (e) => {
    e.preventDefault();
    dispatch(registerPartner(formData)).then((res) => {
      if (!res.error) {
        toast.success("Partner Registered!");
        // 🔥 This "navigates" back to the partner list view
        setShowAddForm(false); 
        setFormData({ name: '', email: '', password: 'password123' });
      } else {
        toast.error(res.payload || "Failed to register partner");
      }
    });
  };

  const handleAssign = (orderId, partnerId) => {
    dispatch(assignOrder({ orderId, partnerId }))
      .then((res) => {
        if (!res.error) {
          toast.success("Order assigned successfully!");
        } else {
          toast.error(res.payload || "Assignment failed");
        }
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Delivery Logistics</h2>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setShowAddForm(false); // Ensure list shows first when opening
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          + Manage Partners
        </button>
      </div>

      {/* Main Assign List (The "Delivery Assign List") */}
      <div className="bg-white/5 rounded-[32px] border border-white/10 overflow-hidden backdrop-blur-md">
        {orders?.length > 0 ? (
          orders.map(order => (
            <AdminAssignRow 
              key={order._id} 
              order={order} 
              partners={partners} 
              onAssign={handleAssign} 
            />
          ))
        ) : (
          <p className="p-10 text-center text-gray-500 italic">No pending orders for assignment.</p>
        )}
      </div>

      {/* Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">
                  {showAddForm ? 'Register New Rider' : 'Delivery Partner List'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white text-3xl">&times;</button>
              </div>

              {showAddForm ? (
                <form onSubmit={handleAddPartner} className="space-y-4 animate-fadeIn">
                  <input 
                    type="text" placeholder="Name" required
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="email" placeholder="Email" required
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-emerald-500 py-4 rounded-2xl font-bold text-white">Save Partner</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-4 rounded-2xl border border-white/10 text-white font-medium">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                       <div className="p-10 text-center text-emerald-500 animate-pulse font-medium">Fetching riders...</div>
                    ) : partners?.length > 0 ? (
                      partners.map(p => (
                        <div key={p._id} className="flex justify-between items-center p-5 bg-white/5 rounded-[24px] border border-white/5 hover:border-white/10 transition-all">
                          <div>
                            <p className="text-white font-semibold text-lg">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${p.isAvailable ? 'text-emerald-400' : 'text-red-500'}`}>
                              {p.isAvailable ? 'Online' : 'Offline'}
                            </span>
                            <button 
                              onClick={() => handleToggle(p._id, p.isAvailable)}
                              className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${p.isAvailable ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-gray-800 border border-white/5'}`}
                            >
                              <div className={`w-5 h-5 rounded-full transition-all duration-500 shadow-sm ${p.isAvailable ? 'translate-x-7 bg-emerald-400' : 'translate-x-0 bg-gray-500'}`} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 p-4">No partners registered.</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="w-full mt-8 py-4 border-2 border-dashed border-white/10 rounded-[24px] text-gray-400 font-medium hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
                  >
                    + Add Another Partner
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManagement;
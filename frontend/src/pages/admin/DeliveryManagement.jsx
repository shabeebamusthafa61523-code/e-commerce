import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminAssignRow from './AdminAssignRow';
import { 
  fetchPartners, 
  registerPartner, 
  assignOrder 
} from '../../features/delivery/DeliverySlice';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaMotorcycle, FaSignal, FaTimes, FaCircle, FaInbox } from 'react-icons/fa';

const DeliveryManagement = ({ orders = [] }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: 'password123', 
    role: 'delivery' 
  });

  const { partners = [], loading } = useSelector((state) => state.delivery || {});

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const handleAddPartner = (e) => {
    e.preventDefault();
    dispatch(registerPartner(formData)).then((res) => {
      if (!res.error) {
        toast.success(`${formData.name} added to the fleet!`, {
          style: { background: '#10b981', color: '#fff', fontWeight: 'bold' }
        });
        setShowAddForm(false); 
        setFormData({ name: '', email: '', password: 'password123', role: 'delivery' });
      } else {
        toast.error(res.payload || "Registration failed");
      }
    });
  };

  const handleAssign = (orderId, partnerId) => {
    dispatch(assignOrder({ orderId, partnerId }))
      .then((res) => {
        if (!res.error) {
          toast.success("Rider Dispatched Successfully", {
            icon: '🚀',
            style: { borderRadius: '15px', background: '#1a1a1a', color: '#fff' }
          });
        }
      });
  };

  // Filter for orders that need a rider
  const validOrders = orders?.filter(o => o.orderStatus === 'placed' && !o.deliveryPartner) || [];

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter italic">Logistics Control<span className="text-emerald-500">.</span></h2>
          <p className="text-gray-500 font-bold mt-2 uppercase text-[10px] tracking-[0.4em]">
            Fleet Intelligence & Real-time Routing
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Available Fleet</p>
            <p className="text-2xl font-black text-white">
              {partners.filter(p => p.isAvailable).length}<span className="text-gray-700 mx-2">/</span>{partners.length}
            </p>
          </div>
          <button 
            onClick={() => { setIsModalOpen(true); setShowAddForm(false); }}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-5 rounded-[24px] font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.15)] flex items-center gap-3"
          >
            <FaUserPlus size={16} /> Manage Fleet
          </button>
        </div>
      </div>

      {/* ASSIGNMENT HUB */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-[#111] rounded-[48px] border border-white/5 overflow-hidden shadow-3xl">
          <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <FaInbox size={20} />
              </div>
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-sm">Incoming Shipments</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{validOrders.length} Orders awaiting pickup</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/5 min-h-[300px]">
            {validOrders.length > 0 ? (
              validOrders.map(order => (
                <AdminAssignRow 
                  key={order._id} 
                  order={order} 
                  partners={partners.filter(p => p.isAvailable)} // Only show online partners for assignment
                  onAssign={handleAssign} 
                />
              ))
            ) : (
              <div className="py-32 text-center">
                <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSignal className="text-gray-700 animate-pulse" size={24} />
                </div>
                <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Frequency Clear • Scanning for Orders</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MANAGEMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-2xl rounded-[56px] shadow-3xl overflow-hidden">
            <div className="p-12">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    {showAddForm ? 'Enlist Partner' : 'Fleet Registry'}
                  </h3>
                  <div className="h-1 w-12 bg-emerald-500 mt-2 rounded-full" />
                </div>
                <button onClick={() => setIsModalOpen(false)} className="size-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <FaTimes size={20} />
                </button>
              </div>

              {showAddForm ? (
                <form onSubmit={handleAddPartner} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase ml-4">Full Name</label>
                    <input 
                      type="text" required
                      className="w-full bg-white/[0.03] border border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase ml-4">Email Address</label>
                    <input 
                      type="email" required
                      className="w-full bg-white/[0.03] border border-white/5 p-6 rounded-[28px] text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4 pt-10">
                    <button type="submit" className="flex-1 bg-white text-black py-6 rounded-[30px] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-emerald-500 transition-all shadow-xl shadow-white/5">Complete Onboarding</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-10 py-6 rounded-[30px] border border-white/10 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/5">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {partners.length > 0 ? partners.map(p => (
                      <div key={p._id} className="flex justify-between items-center p-6 bg-white/[0.02] rounded-[32px] border border-white/5">
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div className="size-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-black text-xl border border-white/5">
                              {p.name?.charAt(0)}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-4 border-[#0d0d0d] ${p.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          </div>
                          <div>
                            <p className="text-white font-black text-lg leading-none tracking-tight">{p.name}</p>
                            <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-widest">{p.email}</p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${p.isAvailable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {p.isAvailable ? 'Signal Active' : 'Offline'}
                        </div>
                      </div>
                    )) : (
                      <p className="text-center py-10 text-gray-600 font-bold uppercase text-xs">No partners registered</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="w-full mt-10 py-6 border-2 border-dashed border-white/10 rounded-[32px] text-gray-500 font-black hover:border-emerald-500/30 hover:text-emerald-500 transition-all uppercase tracking-[0.2em] text-[10px]"
                  >
                    + Enlist New Fleet Member
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
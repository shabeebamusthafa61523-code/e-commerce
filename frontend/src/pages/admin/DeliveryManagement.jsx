import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminAssignRow from './AdminAssignRow';
import { 
  fetchPartners, 
  registerPartner, 
  assignOrder 
} from '../../features/delivery/DeliverySlice';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaMotorcycle, FaSignal, FaTimes, FaCircle } from 'react-icons/fa';

const DeliveryManagement = ({ orders = [] }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  // Defaulting role to 'delivery' to match your backend controller logic
  const [formData, setFormData] = useState({ name: '', email: '', password: 'password123', role: 'delivery' });

  const { partners = [], loading } = useSelector((state) => state.delivery || {});

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const handleAddPartner = (e) => {
    e.preventDefault();
    dispatch(registerPartner(formData)).then((res) => {
      if (!res.error) {
        toast.success(`${formData.name} is now part of the fleet!`);
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
          toast.success("Assignment live! Rider notified.");
        }
      });
  };

  const validOrders = orders?.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'placed') || [];

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Logistics Control</h2>
          <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">
            Fleet Management & Real-time Assignment
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hidden lg:block">
            <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Active Fleet</p>
            <p className="text-xl font-black text-emerald-400">
              {partners.filter(p => p.isAvailable).length} <span className="text-gray-600">/ {partners.length}</span>
            </p>
          </div>
          <button 
            onClick={() => { setIsModalOpen(true); setShowAddForm(false); }}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
          >
            <FaUserPlus /> Manage Fleet
          </button>
        </div>
      </div>

      {/* 2. LIVE ASSIGNMENT LIST */}
      <div className="bg-[#111] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
          <FaMotorcycle className="text-emerald-500" />
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-300">Pending Assignments</h3>
        </div>

        <div className="divide-y divide-white/5">
          {validOrders.length > 0 ? (
            validOrders.map(order => (
              <AdminAssignRow 
                key={order._id} 
                order={order} 
                partners={partners} 
                onAssign={handleAssign} 
              />
            ))
          ) : (
            <div className="py-20 text-center text-gray-500">
              <FaSignal className="mx-auto mb-4 text-gray-700" size={32} />
              <p className="italic">Scanning for new orders...</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. MANAGEMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-[#111] border border-white/10 w-full max-w-2xl rounded-[48px] shadow-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-white">
                  {showAddForm ? 'Enlist Rider' : 'Fleet Overview'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <FaTimes size={24} />
                </button>
              </div>

              {showAddForm ? (
                <form onSubmit={handleAddPartner} className="space-y-4">
                  <input 
                    type="text" placeholder="Full Name" required
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="email" placeholder="Email Address" required
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 bg-white text-black py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors">Confirm Registration</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-5 rounded-[24px] border border-white/10 text-white font-bold">Back</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
                    {partners.map(p => (
                      <div key={p._id} className="flex justify-between items-center p-6 bg-white/[0.03] rounded-[32px] border border-white/5 transition-all">
                        <div className="flex items-center gap-4">
                          {/* Static color indicator instead of toggle */}
                          <FaCircle className={p.isAvailable ? 'text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'text-red-500'} size={12} />
                          <div>
                            <p className="text-white font-bold text-lg leading-none">{p.name}</p>
                            <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-tighter">{p.email}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${p.isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {p.isAvailable ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="w-full mt-8 py-5 border-2 border-dashed border-white/10 rounded-[32px] text-gray-500 font-bold hover:border-emerald-500/40 hover:text-emerald-400 transition-all uppercase tracking-widest text-[10px]"
                  >
                    + Add New Delivery Partner
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
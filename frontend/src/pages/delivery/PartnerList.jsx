import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartners } from '../../features/delivery/DeliverySlice';
import { Loader2, Phone, Truck, UserPlus, X, ShieldCheck, Mail, Smartphone, Hash } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PartnerList = () => {
  const dispatch = useDispatch();
  const { partners = [], loading } = useSelector((state) => state.delivery || {});
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    password: 'pacha123' // Hardcoded Password
  });

  // AUTO-UPDATE LOGIC: Refreshes status every 30 seconds
  useEffect(() => {
    dispatch(fetchPartners());
    const interval = setInterval(() => {
      dispatch(fetchPartners());
    }, 30000); 

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Authorizing Fleet Entry...");
    
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { 
        headers: { 
          Authorization: `Bearer ${userInfo?.token}`,
          "Content-Type": "application/json"
        } 
      };
      
      // POST to your secured Render backend
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/delivery/register`, 
        formData, 
        config
      );

      toast.success(`${formData.name} successfully registered!`, { id: loadingToast });
      setIsModalOpen(false);
      // Reset form but keep the hardcoded password
      setFormData({ name: '', email: '', phone: '', vehicleNumber: '', password: 'pacha123' });
      dispatch(fetchPartners()); // Instant refresh of the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed", { id: loadingToast });
    }
  };

  if (loading && partners.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
      
      {/* HEADER SECTION */}
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Fleet Registry</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Live Personnel: {partners.length} Riders
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95 w-full md:w-auto justify-center"
        >
          <UserPlus size={16} /> Add New Partner
        </button>
      </div>

      {/* RESPONSIVE TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset ID</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {partners.map((partner) => (
              <tr key={partner._id} className="hover:bg-slate-50/30 transition-all group">
                {/* Name & Avatar */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center text-white font-black text-xs transition-all ${partner.isAvailable ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-300'}`}>
                      {partner.name?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{partner.name}</p>
                  </div>
                </td>

                {/* Contact Info */}
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                      <Smartphone size={10} className="text-slate-400" /> {partner.phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] italic">
                      <Mail size={10} /> {partner.email}
                    </div>
                  </div>
                </td>

                {/* Vehicle Info */}
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-mono font-black uppercase">
                    <Truck size={12} className="text-slate-300" /> {partner.vehicleNumber || '---'}
                  </div>
                </td>

                {/* Status Toggle (Online/Offline) */}
                <td className="px-8 py-5 text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${partner.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    <div className={`size-1.5 rounded-full ${partner.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    {partner.isAvailable ? 'Online' : 'Offline'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {partners.length === 0 && !loading && (
        <div className="p-20 text-center flex flex-col items-center gap-4">
          <Truck size={48} className="text-slate-100" />
          <p className="text-slate-400 font-bold italic text-sm uppercase tracking-widest">Fleet Registry Empty</p>
        </div>
      )}

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">New <span className="text-emerald-500">Recruit</span></h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Personnel Authorization Form</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 p-2 hover:bg-slate-50 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest flex items-center gap-1">Rider Name</label>
                <input required placeholder="ENTER FULL NAME" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-emerald-500 transition-all uppercase" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest">Email Identity</label>
                <input required type="email" placeholder="EMAIL@ADDRESS.COM" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-emerald-500 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>

              {/* Phone & Vehicle Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest flex items-center gap-1"><Smartphone size={8}/> Phone</label>
                  <input required placeholder="NUMBER" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-emerald-500 transition-all" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest flex items-center gap-1"><Truck size={8}/> Asset ID</label>
                  <input required placeholder="VEHICLE NO" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-emerald-500 transition-all uppercase" value={formData.vehicleNumber} onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})} />
                </div>
              </div>

              {/* Hardcoded Password Notification */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between mt-2">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><Hash size={10}/> Default Access</span>
                <span className="text-xs font-mono font-black text-emerald-700">pacha123</span>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all mt-6 flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 active:scale-95"
              >
                <ShieldCheck size={18} /> Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerList;
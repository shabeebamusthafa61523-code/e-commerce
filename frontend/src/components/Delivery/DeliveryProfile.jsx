import React, { useState } from 'react';
import { FaShieldAlt, FaIdCard, FaSave } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DeliveryProfile = ({ user }) => {
  const [vehicleNumber, setVehicleNumber] = useState(user.vehicleNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    // Logic to call your backend: axios.put('/api/users/profile', { vehicleNumber })
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile details updated", {
        style: { borderRadius: '15px', background: '#1a1a1a', color: '#fff' }
      });
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn pb-20">
      {/* 1. Header & Identity */}
      <div className="flex flex-col items-center mb-12">
        <div className="relative group">
          <div className="w-36 h-36 rounded-[40px] bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] mb-6 transition-transform group-hover:rotate-6">
            <div className="w-full h-full rounded-[38px] bg-[#050505] flex items-center justify-center border-[6px] border-[#050505] overflow-hidden">
               <span className="text-5xl font-black text-white">{user.name?.[0]}</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-2 rounded-xl shadow-lg">
            <FaShieldAlt size={14} />
          </div>
        </div>
        
        <h3 className="text-3xl font-black text-white tracking-tighter">{user.name}</h3>
        <p className="text-emerald-400 text-[10px] font-black tracking-[0.3em] uppercase mt-2">
          Fleet Partner Alpha
        </p>
      </div>

      <div className="space-y-6">
        {/* 2. Personal Info Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[40px]">
          <div className="flex items-center gap-3 mb-6">
            <FaIdCard className="text-gray-500" />
            <h5 className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Account Dossier</h5>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-500 text-sm font-medium">Official Email</span>
              <span className="text-white font-bold">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-gray-500 text-sm font-medium">Phone Support</span>
              <span className="text-white font-bold">{user.phone || '+91 98765 43210'}</span>
            </div>
          </div>
        </div>

        {/* 3. Operational Details Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[40px]">
          <h5 className="text-gray-400 text-[10px] uppercase font-black mb-6 tracking-widest">Operational Data</h5>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-gray-500 text-xs font-bold uppercase">Vehicle Plate Number</label>
              <input 
                type="text" 
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="KL-XX-XXXX" 
                className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-mono tracking-widest"
              />
            </div>

            <button 
              onClick={handleUpdateProfile}
              disabled={isSaving}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
            >
              <FaSave />
              {isSaving ? 'Synchronizing...' : 'Save Profile Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;
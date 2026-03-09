import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  User, ShieldCheck, Truck, Mail, Phone, 
  Save, Loader2, Edit3, X, CheckCircle 
} from "lucide-react";
import { updateProfile, resetDeliveryStatus } from "../../features/delivery/DeliverySlice";

const DeliveryProfile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { loading, success, error } = useSelector((state) => state.delivery);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    phone: ""
  });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        vehicleNumber: userInfo.vehicleNumber || "",
        phone: userInfo.phone || ""
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (success) {
      setIsEditing(false);
      setTimeout(() => dispatch(resetDeliveryStatus()), 3000);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    dispatch(updateProfile(formData));
  };

  if (!userInfo) return null;

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen animate-fadeIn">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
            Rider Profile<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">
            Identity & Asset Management
          </p>
        </div>

        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isEditing ? "bg-red-50 text-red-600 border border-red-100" : "bg-white text-slate-900 border border-slate-100 shadow-sm"
          }`}
        >
          {isEditing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
        </button>
      </header>

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="size-28 rounded-[38px] bg-slate-900 flex items-center justify-center text-white text-4xl font-black mb-6">
              {userInfo.name?.charAt(0)}
            </div>
            <h3 className="text-2xl font-black text-slate-900">{userInfo.name}</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-2 px-4 py-1 bg-emerald-50 rounded-full italic">
              Verified Partner
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <User size={14} /> System Details
            </h5>
            
            <div className="space-y-6">
               <div className="flex justify-between border-b border-slate-50 pb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Login Email</span>
                  <span className="text-sm font-black text-slate-700">{userInfo.email}</span>
               </div>

               <div>
                <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Mobile Reference</label>
                {isEditing ? (
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border p-4 rounded-2xl font-bold" />
                ) : (
                  <p className="text-lg font-black text-slate-900">{formData.phone || "Not Set"}</p>
                )}
               </div>

               <div>
                <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">Vehicle Plate</label>
                {isEditing ? (
                  <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} className="w-full bg-slate-50 border p-4 rounded-2xl font-mono" />
                ) : (
                  <p className="text-lg font-black text-slate-900 font-mono">{formData.vehicleNumber || "UNREGISTERED"}</p>
                )}
               </div>
            </div>
          </div>

          {isEditing && (
            <button onClick={handleUpdate} disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Synchronize Profile</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;
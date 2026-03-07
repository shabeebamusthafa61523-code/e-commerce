import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  User, ShieldCheck, Truck, Mail, Phone, 
  Save, Loader2, Edit3, X, CheckCircle 
} from "lucide-react";
// Import the action from your slice
import { updateProfile, resetDeliveryStatus } from "../../features/delivery/DeliverySlice";

const DeliveryProfile = () => {
  const dispatch = useDispatch();
  
  // Select data from both auth (for identity) and delivery (for status)
  const { userInfo } = useSelector((state) => state.auth);
  const { loading, success, error } = useSelector((state) => state.delivery);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    phone: ""
  });

  // Sync local state with Redux userInfo
  useEffect(() => {
    if (userInfo) {
      setFormData({
        vehicleNumber: userInfo.vehicleNumber || "",
        phone: userInfo.phone || ""
      });
    }
  }, [userInfo]);

  // Handle success reset
  useEffect(() => {
    if (success) {
      setIsEditing(false);
      // Optional: Add a toast notification here
      setTimeout(() => dispatch(resetDeliveryStatus()), 3000);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    dispatch(updateProfile(formData));
  };

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
          Syncing Secure Identity...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen animate-fadeIn">
      {/* Header Section */}
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
          disabled={loading}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isEditing 
            ? "bg-red-50 text-red-600 border border-red-100" 
            : "bg-white text-slate-900 border border-slate-100 shadow-sm hover:shadow-md"
          } disabled:opacity-50`}
        >
          {isEditing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
        </button>
      </header>

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Identity Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center sticky top-10">
            <div className="relative mb-6">
              <div className="size-28 rounded-[38px] bg-slate-900 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-slate-300">
                {userInfo.name?.charAt(0)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                <ShieldCheck size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{userInfo.name}</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-2 px-4 py-1 bg-emerald-50 rounded-full italic">
              Verified Partner
            </p>

            {success && (
              <div className="mt-6 flex items-center gap-2 text-emerald-600 animate-bounce">
                <CheckCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Profile Synced</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Details Block */}
          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
              <User size={14} /> System Credentials
            </h5>
            
            <div className="space-y-8">
              {/* Email - Read Only */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 py-2 border-b border-slate-50 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Mail size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Login Email</span>
                </div>
                <span className="text-sm font-black text-slate-700">{userInfo.email}</span>
              </div>

              {/* Contact Number - Editable */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Phone size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Number</span>
                </div>
                
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-slate-700"
                  />
                ) : (
                  <p className="text-lg font-black text-slate-900 ml-11">
                    {formData.phone || <span className="text-slate-300 italic text-sm font-medium">No contact provided</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Asset Block */}
          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
            <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
              <Truck size={14} /> Asset Registration
            </h5>
            
            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Vehicle Plate Reference
              </label>
              
              {isEditing ? (
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  placeholder="e.g. KL 07 AB 1234"
                  className="w-full bg-slate-50 border border-slate-100 p-5 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-mono font-bold text-slate-700"
                />
              ) : (
                <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-100">
                  <span className="text-lg font-black text-slate-900 font-mono tracking-tight">
                    {formData.vehicleNumber || "UNREGISTERED"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Save Action */}
          {isEditing && (
            <button 
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-emerald-600 shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] disabled:bg-slate-400"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Save size={18} />
                  Synchronize Profile
                </>
              )}
            </button>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;
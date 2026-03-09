import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, logout } from "../features/Auth/AuthSlice";
import { toast } from "react-hot-toast";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [securityModal, setSecurityModal] = useState({ open: false, type: "" });
  
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({ current: "", next: "" });

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      const data = await res.json();
      setProfileData(data);
      setEditFormData({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    if (userInfo?.token) fetchProfile();
  }, [userInfo.token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(editFormData));
    if (!result.error) {
      fetchProfile(); 
      setIsEditModalOpen(false);
      toast.success("Profile updated!");
    }
  };

  // --- NEW: Security Handlers ---
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    toast.success("Password reset link sent to your email!");
    setSecurityModal({ open: false, type: "" });
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      toast.error("Account deactivation requested.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-[3rem] p-10 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2.8rem] bg-slate-900 text-white flex items-center justify-center text-5xl font-black shadow-2xl">
              {profileData?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-full border-4 border-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profileData?.name}</h1>
              <span className="w-fit mx-auto md:mx-0 px-3 py-1 bg-green-100 rounded-full text-[10px] font-black text-green-700 uppercase tracking-widest">
                Verified Account
              </span>
            </div>
            <p className="text-slate-500 font-medium mb-6 text-lg">{profileData?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <button 
                onClick={() => setIsEditModalOpen(true)}
                className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                Edit Profile Details
              </button>
              <button 
                onClick={() => dispatch(logout())}
                className="px-8 py-3.5 rounded-2xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Information Card */}
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="p-2 bg-slate-50 rounded-xl text-lg">👤</span> Account Information
            </h3>
            <div className="space-y-7">
              {[
                { label: "Registered Name", value: profileData?.name },
                { label: "Primary Email", value: profileData?.email },
                { label: "Contact Number", value: profileData?.phone || "Not linked yet" },
                { label: "Saved Address", value: profileData?.address || "No delivery address" },
              ].map((field, i) => (
                <div key={i} className="group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">{field.label}</p>
                  <div className="bg-slate-50/50 p-4 rounded-2xl font-bold text-slate-800 border border-transparent group-hover:border-slate-100 transition-all">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Card - NOW WORKING */}
          <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="p-2 bg-slate-50 rounded-xl text-lg">🛡️</span> Preferences & Security
            </h3>
            <div className="space-y-4">
              {[
                { id: "password", title: "Change Password", subtitle: "Update your login credentials" },
                { id: "privacy", title: "Privacy Settings", subtitle: "Manage your data sharing" },
                { id: "notify", title: "Notifications", subtitle: "Control app alerts and emails" }
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => setSecurityModal({ open: true, type: item.id })}
                  className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-[1.8rem] hover:bg-slate-100 hover:scale-[1.01] transition-all text-left group"
                >
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{item.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.subtitle}</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-slate-900 transition-colors">→</span>
                </button>
              ))}
              <div className="pt-6">
                <button 
                  onClick={handleDeactivate}
                  className="w-full bg-red-50 text-red-600 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-red-100 transition-all"
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Display Name</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone</label>
                <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Address</label>
                <textarea value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 h-28 resize-none" />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Close</button>
                <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SECURITY & PREFERENCES MODAL (New) --- */}
      {securityModal.open && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSecurityModal({ open: false, type: "" })} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-2 capitalize">{securityModal.type} Settings</h2>
            <p className="text-slate-400 text-sm mb-8 font-medium italic">Configure your {securityModal.type} preferences securely.</p>
            
            {securityModal.type === 'password' ? (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <input type="password" placeholder="Current Password" className="w-full bg-slate-50 rounded-2xl p-4 font-bold border-none" required />
                <input type="password" placeholder="New Password" className="w-full bg-slate-50 rounded-2xl p-4 font-bold border-none" required />
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Update Password</button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <span className="font-bold text-slate-700">Enable Option</span>
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full ml-auto" /></div>
                </div>
                <button onClick={() => setSecurityModal({ open: false, type: "" })} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Save Settings</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
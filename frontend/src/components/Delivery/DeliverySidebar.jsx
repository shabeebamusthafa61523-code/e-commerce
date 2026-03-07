import React from 'react';
import { History, UserCircle, LogOut, Package, Zap, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const DeliverySidebar = ({ 
  activeTab, 
  setActiveTab, 
  handleLogout, 
  isOnline = true,
  isOpen,         
  onClose         
}) => {

  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Active Tasks', path: "/delivery/dashboard", icon: <Package size={20} /> },
    { id: 'history', label: 'Past Deliveries', path: "/delivery/history", icon: <History size={20} /> },
    { id: 'profile', label: 'My Profile', path: "/delivery/profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <>
      {/* BACKDROP */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-100 z-[200] p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        <button onClick={onClose} className="absolute right-4 top-6 text-slate-400 hover:text-red-500 lg:hidden">
          <X size={20}/>
        </button>

        <div className="mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100">
              P
            </div>
            <div>
              <h2 className="font-black text-slate-900 leading-none tracking-tight text-lg">PACHA.CART</h2>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Logistics Core</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);   // ✅ route navigation
                onClose();
              }}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`${activeTab === item.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                {item.icon}
              </span>
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mb-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Duty Status</span>
            <div className={`size-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          </div>
          <div className="flex items-center gap-3">
            <div className={`size-9 rounded-lg flex items-center justify-center ${isOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              <Zap size={16} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{isOnline ? 'Online' : 'Offline'}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase">Ready for pings</p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};

export default DeliverySidebar;
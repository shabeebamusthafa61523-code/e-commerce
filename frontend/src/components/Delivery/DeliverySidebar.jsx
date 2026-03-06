import React from 'react';
import { LayoutDashboard, History, UserCircle, LogOut, Package } from 'lucide-react'; // Using Lucide for clean icons

const DeliverySidebar = ({ activeTab, setActiveTab, handleLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Active Tasks', icon: <Package size={20} /> },
    { id: 'history', label: 'Past Deliveries', icon: <History size={20} /> },
    { id: 'profile', label: 'My Profile', icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 text-white transition-all">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
          <Package className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight">Pacha.Cart <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase ml-1">Rider</span></span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
              activeTab === item.id 
              ? 'bg-gradient-to-r from-emerald-600/80 to-teal-500/80 shadow-lg shadow-emerald-900/20 text-white' 
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all mt-auto"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};
export default DeliverySidebar;
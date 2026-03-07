import React, { useState } from 'react';
import { FaThLarge, FaHistory, FaUserCircle, FaPowerOff } from 'react-icons/fa';
const DeliveryLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sidebar Items Configuration
   const menuItems = [
  { id: 'dashboard', label: 'Active Tasks', icon: <FaThLarge /> }, // Changed from FaLayout
  { id: 'history', label: 'Past Trips', icon: <FaHistory /> },
  { id: 'profile', label: 'Account', icon: <FaUserCircle /> },
];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      
      {/* 1. FIXED SIDEBAR (Premium Glass) */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0a0a0a] border-r border-white/5 p-8 flex flex-col z-50">
        <div className="mb-12">
          <h2 className="text-2xl font-black tracking-tighter text-emerald-500">PACHA.RIDER</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Delivery Partner Pro</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-emerald-500 text-black shadow-[0_10px_20px_rgba(16,185,129,0.2)] scale-105' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Section: Logout */}
        <button className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all">
          <FaPowerOff />
          Logout
        </button>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      {/* Padding left (ml-72) matches sidebar width */}
      <main className="flex-1 ml-72 min-h-screen relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-6xl mx-auto p-10 animate-fadeIn">
          {activeTab === 'dashboard' && <ActiveTasksScreen />}
          {activeTab === 'history' && <DeliveryHistoryScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </div>
      </main>

    </div>
  );
};

// Placeholder components to prevent errors
const ActiveTasksScreen = () => <div className="animate-slideUp">Active Deliveries View</div>;
const DeliveryHistoryScreen = () => <div className="animate-slideUp">History Records View</div>;
const ProfileScreen = () => <div className="animate-slideUp">Rider Profile View</div>;

export default DeliveryLayout;
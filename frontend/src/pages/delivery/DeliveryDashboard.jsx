import React, { useState } from 'react';
import { Package, MapPin, Navigation, Clock } from 'lucide-react';

const DeliveryDashboard = () => {
  const [subTab, setSubTab] = useState('marketplace'); // 'marketplace' or 'tasks'

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
          Rider Terminal<span className="text-emerald-500">.</span>
        </h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Pacha.Cart Logistics Division</p>
      </header>

      {/* Internal Sub-Navigation */}
      <div className="flex gap-2 mb-8 bg-slate-200/50 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setSubTab('marketplace')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            subTab === 'marketplace' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Marketplace (0)
        </button>
        <button 
          onClick={() => setSubTab('tasks')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            subTab === 'tasks' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          My Tasks (0)
        </button>
      </div>

      {/* Dynamic Content Area */}
      <div className="border-2 border-dashed border-slate-200 rounded-[2rem] min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-slate-200/50 p-6 rounded-full mb-6">
          <Package className="text-slate-400 size-10 animate-bounce" />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
          {subTab === 'marketplace' ? 'No orders in marketplace' : 'No active tasks assigned'}
        </h3>
        <p className="text-slate-500 text-sm font-medium mt-2 max-w-xs">
          {subTab === 'marketplace' 
            ? 'Waiting for new pings from the Logistics Core. Keep your duty status active.' 
            : 'When you accept an order from the marketplace, it will appear here.'}
        </p>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
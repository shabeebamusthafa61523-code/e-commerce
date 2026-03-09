import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartners } from '../../features/delivery/DeliverySlice';
import { Loader2, Phone, Truck } from 'lucide-react';

const PartnerList = () => {
  const dispatch = useDispatch();
  // Ensure we fallback to an empty array to prevent mapping errors
  const { partners = [], loading } = useSelector((state) => state.delivery || {});

  useEffect(() => {
    // Initial fetch
    dispatch(fetchPartners());

    // Optional: Refresh the list every 30 seconds to catch status changes
    // while the admin is watching the dashboard
    const interval = setInterval(() => {
      dispatch(fetchPartners());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading && partners.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Fleet Registry</h3>
        <span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">
          Active Riders: {partners.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase">Identity</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase">Contact Details</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase">Asset Info</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {partners.map((partner) => {
              // Note: Ensure your backend returns 'isAvailable' or 'isOnline'
              const isOnline = partner.isAvailable; 

              return (
                <tr key={partner._id} className="hover:bg-slate-50/30 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-xl flex items-center justify-center text-white font-black text-xs transition-colors ${isOnline ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-300'}`}>
                        {partner.name?.charAt(0)}
                      </div>
                      <p className="text-sm font-black text-slate-900">{partner.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone size={12} className="text-slate-400" />
                      <span className="text-xs font-bold">{partner.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Truck size={12} className="text-slate-400" />
                      <span className="text-xs font-mono font-black uppercase">{partner.vehicleNumber || 'Pending'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${isOnline ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                      <div className={`size-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      {isOnline ? 'Online' : 'Offline'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {partners.length === 0 && !loading && (
        <div className="text-center py-10 text-slate-400 italic text-sm font-bold">
          No delivery partners registered in the fleet.
        </div>
      )}
    </div>
  );
};

export default PartnerList;
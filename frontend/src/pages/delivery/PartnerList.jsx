import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartners } from '../../features/delivery/DeliverySlice';
import { Loader2, Zap, ShieldCheck, Power, Ghost } from 'lucide-react';

const PartnerList = () => {
  const dispatch = useDispatch();
  const { partners = [], loading } = useSelector((state) => state.delivery || {});

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 bg-white rounded-[2rem]">
      <Loader2 className="animate-spin mb-4 text-emerald-500" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Syncing Fleet Status...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            Fleet Registry <Zap size={18} className="text-emerald-500 fill-emerald-500" />
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
            Real-Time Availability Tracking
          </p>
        </div>
        <div className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl">
          <span className="text-[10px] font-black uppercase tracking-wider">
            Total Fleet: {partners.length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {partners.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {partners.map((partner) => (
                <tr key={partner._id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`size-11 rounded-2xl flex items-center justify-center text-white font-black text-sm transition-all ${partner.isAvailable ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-slate-200'}`}>
                        {partner.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{partner.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <ShieldCheck size={10} className={partner.isAvailable ? 'text-emerald-500' : 'text-slate-300'} />
                          <p className={`text-[9px] font-black uppercase tracking-tighter ${partner.isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {partner.isAvailable ? 'Verified Dispatcher' : 'Offline'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-8 py-5 text-right">
                    {/* ONLY SHOW LIVE IF TOGGLE (isAvailable) IS TRUE */}
                    {partner.isAvailable ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm animate-in fade-in slide-in-from-right-2 duration-500">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Now</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 grayscale">
                        <Power size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Stationary</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-24 text-center">
            <Ghost className="mx-auto mb-4 text-slate-200" size={48} />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">No partners registered in fleet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerList;
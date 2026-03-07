import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, CheckCircle2, Loader2, Zap } from 'lucide-react';

const PartnerList = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/delivery-partners');
      
      // Defensive check: Ensure we are setting an array
      const partnersArray = Array.isArray(data) ? data : (data.partners || []);
      setPartners(partnersArray);
      
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setPartners([]); 
      setError("Failed to load available fleet");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // 1. FILTER LOGIC: Only show partners where isAvailable is true
  const availablePartners = (partners || []).filter(p => p.isAvailable === true);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p className="text-xs font-black uppercase tracking-widest italic">Scanning Marketplace...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            Available Partners <Zap size={18} className="text-emerald-500 fill-emerald-500" />
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
            Ready for Instant Dispatch
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100">
          <span className="text-[10px] font-black uppercase">
            {availablePartners.length} Online Now
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {availablePartners.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rider Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {availablePartners.map((partner) => (
                <tr key={partner._id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs">
                        {partner.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{partner.name}</p>
                        <p className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter">Verified Partner</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-slate-500">{partner.email}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
                      <CheckCircle2 size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No partners are currently available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerList;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaRegEnvelope, FaCheckCircle, FaEye, FaTrashAlt } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const ManageInquiries = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector((state) => state.auth);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, config);
      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/contact/${id}`, { status: "Read" }, config);
      toast.success("Marked as read");
      fetchMessages(); 
    } catch (err) { toast.error("Error updating status"); }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Inquiry Inbox</h1>
            <p className="text-slate-500">Manage customer messages and refund requests.</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tickets</p>
            <span className="text-2xl font-black text-slate-900">{messages.length}</span>
          </div>
        </header>

        {/* --- INQUIRY TABLE --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
              <tr>
                <th className="p-6">Status</th>
                <th className="p-6">Customer</th>
                <th className="p-6">Subject & Message</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {messages.map((msg) => (
                <tr key={msg._id} className={`hover:bg-slate-50/50 transition-colors ${msg.status === 'New' ? "bg-emerald-50/30" : ""}`}>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${msg.status === 'New' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{msg.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{msg.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col max-w-md">
                      <span className="text-sm font-bold text-slate-700 truncate">{msg.subject}</span>
                      {/* Added Message field to the row */}
                      <span className="text-xs text-slate-400 truncate italic">"{msg.message}"</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setSelectedMsg(msg)} 
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        title="View Full Message"
                      >
                        <FaEye size={18} />
                      </button>
                      {msg.status !== 'Read' && (
                        <button 
                          onClick={() => handleMarkAsRead(msg._id)} 
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Mark as Read"
                        >
                          <FaCheckCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {messages.length === 0 && !loading && (
            <div className="p-20 text-center text-slate-400 font-medium">No inquiries found.</div>
          )}
        </div>
      </div>

      {/* --- MESSAGE MODAL --- */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-mono mb-2 inline-block">
                  ID: {selectedMsg._id}
                </span>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedMsg.subject}</h2>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="text-slate-300 hover:text-red-500 text-3xl font-light">&times;</button>
            </div>
            
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                {selectedMsg.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{selectedMsg.name}</p>
                <p className="text-xs text-slate-400">{selectedMsg.email}</p>
              </div>
            </div>

            <div className="relative mb-10">
              <div className="bg-slate-50 p-8 rounded-[2rem] text-slate-700 leading-relaxed text-lg italic border border-slate-100">
                "{selectedMsg.message}"
              </div>
            </div>

            <div className="flex gap-4">
                <a 
                  href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                  className="flex-1 text-center bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-600 transition-all"
                >
                  Reply to Customer
                </a>
                <button 
                  onClick={() => setSelectedMsg(null)}
                  className="px-8 bg-slate-100 text-slate-500 py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-slate-200"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInquiries;
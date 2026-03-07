import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMarketplaceOrders,
  fetchMyOrders,
  assignOrder,
} from "../../features/delivery/DeliverySlice";
import { Package, MapPin, Clock, ArrowRight, Zap, Loader2 } from "lucide-react";

const DeliveryDashboard = () => {
  const dispatch = useDispatch();
  const [subTab, setSubTab] = useState("marketplace");

  const { marketplaceOrders, myOrders, loading } = useSelector(
    (state) => state.delivery
  );

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMarketplaceOrders());
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleAccept = (orderId) => {
    dispatch(
      assignOrder({
        orderId,
        partnerId: userInfo._id,
      })
    );
  };

  const orders = subTab === "marketplace" ? marketplaceOrders : myOrders;

  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50 animate-fadeIn">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
            Rider Terminal<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">
            Logistics Control Center
          </p>
        </div>
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm w-fit">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Online</span>
        </div>
      </header>

      {/* Sub Tabs Navigation */}
      <div className="flex gap-2 mb-10 bg-slate-200/50 p-1.5 rounded-[22px] w-fit border border-slate-100">
        <button
          onClick={() => setSubTab("marketplace")}
          className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
            subTab === "marketplace"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Marketplace ({marketplaceOrders.length})
        </button>

        <button
          onClick={() => setSubTab("tasks")}
          className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
            subTab === "tasks"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          My Tasks ({myOrders.length})
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Syncing Orders...</p>
        </div>
      ) : (orders || []).length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-[3rem] min-h-[400px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm transition-all hover:bg-white/80">
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <Package className="text-slate-200 size-12" />
          </div>
          <p className="text-slate-900 font-black uppercase text-sm tracking-widest">No active pings</p>
          <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-tighter">Terminal is scanning for new requests</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    Ready for pickup
                  </span>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight mt-3">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h3>
                </div>
                <div className="size-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Zap size={18} fill="currentColor" />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop Location</p>
                    <p className="text-sm font-bold text-slate-700 leading-tight">
                      {order.deliveryAddress?.city || "Local Delivery"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Assigned</p>
                    <p className="text-sm font-bold text-slate-700">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>

              {subTab === "marketplace" ? (
                <button
                  onClick={() => handleAccept(order._id)}
                  className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-emerald-600 shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
                >
                  Accept Delivery <ArrowRight size={14} />
                </button>
              ) : (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current State</span>
                  <span className="text-xs font-black text-emerald-600 uppercase italic">
                    {order.orderStatus}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
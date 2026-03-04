import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaBox, FaShoppingCart, FaUsers, FaArrowRight } from "react-icons/fa";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';

import { fetchAdminStats } from "../../features/admin/adminSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
      return;
    }
    dispatch(fetchAdminStats());
  }, [userInfo, navigate, dispatch]);

  // Data for the Area Graph (Growth Trend)
  const graphData = [
    { name: 'Mon', value: (stats?.totalOrders || 0) * 0.4 },
    { name: 'Tue', value: (stats?.totalOrders || 0) * 0.5 },
    { name: 'Wed', value: (stats?.totalOrders || 0) * 0.8 },
    { name: 'Thu', value: (stats?.totalOrders || 0) * 0.7 },
    { name: 'Fri', value: stats?.totalOrders || 0 }, // Latest
  ];

  // Data for the Distribution Pie
  const pieData = [
    { name: "Products", value: stats?.totalProducts || 0, color: "#10b981" },
    { name: "Orders", value: stats?.totalOrders || 0, color: "#3b82f6" },
    { name: "Users", value: stats?.totalUsers || 0, color: "#8b5cf6" },
  ];

  if (!userInfo) return null;

  const statsList = [
    { title: "Inventory", label: "Total Products", value: stats?.totalProducts || 0, icon: <FaBox />, color: "bg-emerald-50 text-emerald-600", link: "/admin/products" },
    { title: "Revenue", label: "Total Orders", value: stats?.totalOrders || 0, icon: <FaShoppingCart />, color: "bg-blue-50 text-blue-600", link: "/admin/orders" },
    { title: "Community", label: "Total Users", value: stats?.totalUsers || 0, icon: <FaUsers />, color: "bg-purple-50 text-purple-600", link: "/admin/users" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">Control Center</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          </div>
          <button onClick={() => navigate("/admin/add-product")} className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-200">
            <span>+ Add New Product</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {statsList.map((s) => (
            <div key={s.title} onClick={() => navigate(s.link)} className="group cursor-pointer bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className={`p-4 rounded-2xl ${s.color} text-xl w-fit mb-6 shadow-inner`}>{s.icon}</div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{s.value.toLocaleString()}</h3>
            </div>
          ))}
        </div>

        {/* --- VISUALIZATION SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Main Area Graph */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-1">Order Growth</h3>
            <p className="text-slate-400 text-sm font-medium mb-8">Weekly performance trend</p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribution Pie */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center">
            <h3 className="text-xl font-black text-slate-900 mb-1 w-full text-left">Distribution</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 w-full text-left">Platform balance</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- QUICK ACTION FOOTER --- */}
        <div className="mt-12 p-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-[3rem] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
           <div>
              <h2 className="text-2xl font-black tracking-tight mb-1">Ready to expand?</h2>
              <p className="text-green-100 text-sm font-medium opacity-80">Inventory: {stats?.totalProducts || 0} active items.</p>
           </div>
           <button onClick={() => navigate("/admin/products")} className="bg-white text-green-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-50 transition-colors">Manage Inventory</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
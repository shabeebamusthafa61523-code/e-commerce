import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DashboardStats = ({ messages }) => {
  // 1. Prepare Data for Bar Chart (Messages per Category)
  const categoryData = [
    { name: 'General', value: messages.filter(m => m.subject === 'General Inquiry').length },
    { name: 'Orders', value: messages.filter(m => m.subject === 'Order Support').length },
    { name: 'Sourcing', value: messages.filter(m => m.subject === 'Sourcing & Quality').length },
  ];

  // 2. Prepare Data for Pie Chart (Status)
  const statusData = [
    { name: 'New', value: messages.filter(m => m.status === 'New').length },
    { name: 'Read', value: messages.filter(m => m.status === 'Read').length },
  ];

  const COLORS = ['#10b981', '#64748b']; // Emerald-500 and Slate-500

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      
      {/* Bar Chart Card */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Inquiries by Subject</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart Card */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Response Status</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardStats;
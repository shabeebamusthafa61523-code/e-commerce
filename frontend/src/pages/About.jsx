import React from "react";

export default function About() {
  const features = [
    {
      title: "Fresh Products",
      desc: "Daily fresh vegetables and fruits sourced directly from local organic farms.",
      icon: "🥦",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Fast Delivery",
      desc: "Hyper-local delivery network ensuring your groceries arrive within hours.",
      icon: "🚚",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Secure Payments",
      desc: "Bank-grade encryption for all your transactions and saved payment methods.",
      icon: "💳",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Heading */}
        <div className="text-center mb-20">
          <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">
            Since 2024
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            About Pacha<span className="text-green-600">.</span>Cart
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Redefining the digital grocery experience with a commitment to 
            freshness, quality, and local community trust.
          </p>
        </div>

        {/* Mission Section - Glassmorphism Card */}
        <div className="relative group mb-20">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="text-4xl">🌿</span> Our Mission
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  At Pacha.Cart, our mission is to make grocery shopping easy, 
                  affordable, and reliable. We bridge the gap between local farmers 
                  and your kitchen, ensuring that fair pricing and peak freshness 
                  aren't just goals—they're our daily standard.
                </p>
              </div>
              <div className="w-full md:w-1/3 h-48 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-8xl grayscale hover:grayscale-0 transition-all duration-700">
                🥗
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Our Promise Section */}
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-green-900/20">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-8 flex items-center justify-center gap-3">
              <span className="text-green-500">💚</span> Our Promise
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
              We don’t just deliver groceries — we deliver health, trust, 
              and time back to your family. Pacha.Cart is committed to 
              fostering a sustainable ecosystem where every delivery 
              contributes to a healthier, happier community.
            </p>
            <button className="mt-12 bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-green-600/20">
              Start Shopping
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
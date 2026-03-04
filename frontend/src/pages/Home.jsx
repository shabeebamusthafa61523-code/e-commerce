import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/ProductSlice";

import ProductList from "../components/product/ProductList";
import Aisearch from "../components/ai/Aisearch";
import Recommendations from "../components/ai/Recommendations";

import g1 from "../assets/g1.webp";
import g2 from "../assets/g2.jpg";
import g4 from "../assets/g4.webp";

const categories = [
  { name: "Vegetables", icon: "🥦", color: "bg-emerald-50" },
  { name: "Fruits", icon: "🍎", color: "bg-red-50" },
  { name: "Dairy", icon: "🥛", color: "bg-blue-50" },
  { name: "Rice", icon: "🍚", color: "bg-orange-50" },
  { name: "Snacks", icon: "🍪", color: "bg-yellow-50" },
  { name: "Spices", icon: "🧂", color: "bg-purple-50" },
];

const carouselImages = [g1, g2, g4];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Correctly get userInfo from Redux (within the component)
  // Check your auth slice name - it might be state.userLogin or state.auth
  const userAuth = useSelector((state) => state.auth || state.userLogin || {});
  
  // 2. Fallback to LocalStorage if Redux is empty (Safety net)
  const userInfo = userAuth.userInfo || JSON.parse(localStorage.getItem("userInfo"));

  const { products = [], loading } = useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 10 });

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const pickedForYouItems = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 10);
  }, [products]);

  const flashSaleItems = products
    .filter((p) => {
      const isFlash = p.isFlashSale === true;
      const price = Number(p.price) || 0;
      const dPrice = Number(p.discountPrice) || 0;
      return isFlash || (dPrice > 0 && dPrice < price);
    })
    .slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) return { hours: 0, minutes: 0, seconds: 0 };
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);
    const interval = setInterval(() => setCurrentSlide((p) => (p + 1) % carouselImages.length), 5000);
    return () => { clearInterval(timer); clearInterval(interval); };
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 font-sans space-y-16 pt-10">
      
      {/* TOP SECTION: HERO & FLASH SALE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* HERO SECTION */}
        <section className="lg:col-span-8 relative rounded-[3rem] overflow-hidden bg-slate-900 min-h-[500px] flex items-center shadow-2xl border-4 border-white group">
          <div className="absolute inset-0 z-0">
            <img 
              src={carouselImages[currentSlide]} 
              className="w-full h-full object-cover opacity-60 transition-all duration-[2000ms] scale-110 group-hover:scale-100" 
              alt="Hero" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          </div>
          <div className="relative z-10 px-12 text-white max-w-2xl">
            <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Organic & Fresh</span>
            <h1 className="text-6xl font-black leading-tight mb-6">Freshness <br/><span className="text-emerald-400">Delivered.</span></h1>
            <button onClick={() => navigate("/products")} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 shadow-xl active:scale-95">
              Start Shopping
            </button>
          </div>
        </section>

        {/* FLASH SALE SIDEBAR - RED THEME */}
        <section className="lg:col-span-4 relative rounded-[2.5rem] p-8 bg-white border border-red-50 shadow-[0_32px_64px_-16px_rgba(220,38,38,0.08)] flex flex-col overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-full blur-[80px] -mr-32 -mt-32 z-0" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-400 to-red-500 rounded-t-full z-10" />

          <div className="relative z-10 flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Flash Deals</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Live: Ending Soon</p>
              </div>
            </div>
            
            <div className="flex gap-1.5">
              {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                <div key={i} className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm shadow-lg shadow-red-200">
                  {String(unit).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {flashSaleItems.map((product) => (
              <div key={product._id} onClick={() => navigate(`/product/${product._id}`)} className="group/item flex items-center gap-4 p-3 bg-red-50/30 rounded-[1.5rem] border border-transparent hover:border-red-100 hover:bg-white hover:shadow-xl hover:shadow-red-200/40 transition-all duration-300 cursor-pointer">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm border border-red-50">
                  <img src={product.images?.[0]?.startsWith('http') ? product.images[0] : `http://localhost:5000/${product.images?.[0]?.replace(/^\//, '')}`} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" alt={product.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-800 truncate group-hover/item:text-red-600 transition-colors">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-black text-red-600">₹{product.discountPrice || product.price}</span>
                    {product.discountPrice && <span className="text-[10px] font-bold text-slate-400 line-through">₹{product.price}</span>}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-100/50 flex items-center justify-center text-red-500 group-hover/item:bg-red-600 group-hover/item:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => navigate("/products")} className="relative z-10 mt-6 w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95">
            Claim Your Discount
          </button>
        </section>
      </div>

      <Aisearch />

      {/* SHOP DEPARTMENTS */}
      <section className="bg-emerald-900 p-12 rounded-[4rem] text-white shadow-2xl">
        <h2 className="text-2xl font-black mb-10 text-center uppercase tracking-widest">Shop Departments</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {categories.map((cat, idx) => (
            <button key={idx} onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)} className="flex flex-col items-center group">
              <div className="w-20 h-20 rounded-[2.2rem] flex items-center justify-center text-3xl mb-4 bg-emerald-800 group-hover:bg-white group-hover:text-emerald-900 transition-all group-hover:scale-110">
                {cat.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* PICKED FOR YOU SECTION */}
      <section className="py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 px-4 gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Picked For You</h2>
            <p className="text-slate-400 font-medium">Randomly selected fresh arrivals</p>
          </div>
          <div className="relative w-full md:w-96">
            <input 
              type="text"
              placeholder="Filter results..."
              className="w-full px-6 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <ProductList products={pickedForYouItems} search={searchTerm} /> 

        <div className="mt-12 text-center">
            <button onClick={() => navigate("/products")} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
              Browse Full Inventory
            </button>
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section className="py-10 border-t border-slate-100">
        <div className="mb-8 px-4">
          <h2 className="text-2xl font-black text-slate-800">Based on your activity</h2>
        </div>
        <Recommendations /> 
      </section>

      {/* FOOTER CALL TO ACTION */}
     {/* DYNAMIC CALL TO ACTION */}
<section className="relative rounded-[4rem] overflow-hidden bg-emerald-600 p-20 text-center text-white shadow-2xl group">
  {/* Decorative background element */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50 transition-opacity group-hover:opacity-80" />
  
  <div className="relative z-10 max-w-2xl mx-auto">
    {userInfo ? (
      <>
        {/* LOGGED IN VIEW: Drive Engagement */}
        <h2 className="text-5xl font-black mb-6 tracking-tight">
          Ready for your <br/><span className="text-emerald-200">Weekly Harvest?</span>
        </h2>
        <p className="text-emerald-50 text-lg mb-12 opacity-90 font-medium">
          Welcome back, {userInfo.name.split(' ')[0]}! We've stocked up on your favorites. 
          Check out what's fresh in the warehouse today.
        </p>
        <button 
          onClick={() => navigate("/products")} 
          className="bg-emerald-950 text-white px-12 py-5 rounded-3xl font-black text-lg hover:bg-emerald-900 hover:scale-105 transition shadow-2xl inline-block active:scale-95"
        >
          Explore New Arrivals
        </button>
      </>
    ) : (
      <>
        {/* LOGGED OUT VIEW: Drive Conversion */}
        <h2 className="text-5xl font-black mb-6 tracking-tight">
          Freshness <br/><span className="text-emerald-200">Guarantee.</span>
        </h2>
        <p className="text-emerald-50 text-lg mb-12 opacity-80 font-medium">
          Locally sourced produce delivered to your doorstep. 
          Join thousands of happy families eating fresh every day.
        </p>
        <Link 
          to="/register" 
          className="bg-white text-emerald-700 px-12 py-5 rounded-3xl font-black text-lg hover:scale-105 transition shadow-xl inline-block active:scale-95"
        >
          Join Now
        </Link>
      </>
    )}
  </div>
</section>
    </div>
  );
};

export default Home;
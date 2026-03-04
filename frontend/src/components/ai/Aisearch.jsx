import React, { useState } from "react";
import ProductList from "../../components/product/ProductList";

export default function Aisearch() {
  const [query, setQuery] = useState("");
  const [aiResults, setAiResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchText = query) => {
    if (!searchText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchText }),
      });
      const data = await res.json();
      setAiResults(data.products || []);
    } catch (err) {
      console.error("AI search error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      {/* --- HERO SEARCH CARD --- */}
      <div className="relative bg-slate-900 rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden border border-white/5">
        
        {/* Animated Accent Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />

        <div className="relative z-10 grid lg:grid-cols-5 gap-12 items-center">
          
          {/* Left Side: Branding & Context */}
          <div className="lg:col-span-2 text-left space-y-4">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">Next-Gen Discovery</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Smart <br /> <span className="text-green-500">Grocery AI</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Skip the menus. Tell our AI what you need for your diet or lifestyle.
            </p>
          </div>

          {/* Right Side: Interactive Input & Suggestions */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-slate-800 border border-white/10 rounded-[1.8rem] p-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Try: "High protein meal plan items"'
                  className="flex-1 bg-transparent px-6 py-4 outline-none text-white placeholder:text-slate-500 font-medium text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={() => handleSearch()}
                  className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-green-900/40 active:scale-95 flex items-center space-x-2"
                >
                  <span>Ask AI</span>
                </button>
              </div>
            </div>

            {/* Premium Suggestion Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                "Weight loss plan",
                "High protein ",
                "PCOD friendly",
                "Under ₹2000",
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => { setQuery(item); handleSearch(item); }}
                  className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all active:scale-95"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- RESULTS SECTION --- */}
      {(loading || aiResults.length > 0) && (
        <div className="mt-20 px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-3xl font-black text-slate-900">
                {loading ? "AI is curating your list..." : "Recommended Collections"}
              </h3>
              <div className="h-1 w-20 bg-green-500 mt-2 rounded-full" />
            </div>
            
            {!loading && aiResults.length > 0 && (
              <button 
                onClick={() => {setAiResults([]); setQuery("");}}
                className="text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-tighter transition-colors"
              >
                Clear AI Results
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-slate-100 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50/50 p-8 rounded-[3.5rem] border border-gray-100">
               <ProductList products={aiResults} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
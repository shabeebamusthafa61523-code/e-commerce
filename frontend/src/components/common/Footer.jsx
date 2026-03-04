import { FaLeaf } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-[10px] text-white">
            <FaLeaf />
          </div>
          <span className="text-sm font-black text-slate-900 tracking-tighter">
            Pacha.Cart
          </span>
        </div>

        {/* Links Line */}
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="/shop" className="hover:text-green-600 transition-colors">Shop</a>
          <a href="/privacy" className="hover:text-green-600 transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-green-600 transition-colors">Terms</a>
          <a href="/help" className="hover:text-green-600 transition-colors">Help</a>
        </div>

        {/* Copyright */}
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          © {new Date().getFullYear()} — All Rights Reserved
        </p>

      </div>
    </footer>
  );
}
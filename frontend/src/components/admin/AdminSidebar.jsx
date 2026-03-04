import { Link, useLocation } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

// Destructure 'isOpen' and 'onClose' from props
export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: "📊" },
    { label: "Inventory", path: "/admin/products", icon: "📦" },
    { label: "Logistics", path: "/admin/orders", icon: "🚚" },
    { label: "Customers", path: "/admin/users", icon: "👥" },
    { label: "ManageInquiries", path: "/admin/inquiries", icon: "👥" },
  ];

  return (
    <>
      {/* 1. BACKDROP: Clicks here will close the sidebar */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* 2. SIDEBAR PANEL */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-100 z-[200] p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Close Button (Mobile) */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-6 text-slate-400 hover:text-red-500 lg:hidden"
        >
          <FaTimes size={20}/>
        </button>

        {/* Brand Logo Area */}
        <div className="mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
              G
            </div>
            <div>
              <h2 className="font-black text-slate-900 leading-none tracking-tight">Admin</h2>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose} // Close sidebar when a link is clicked
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive(item.path)
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={`text-lg ${isActive(item.path) ? "opacity-100" : "opacity-50 group-hover:opacity-100"}`}>
                {item.icon}
              </span>
              <span className="text-xs font-black uppercase tracking-widest">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
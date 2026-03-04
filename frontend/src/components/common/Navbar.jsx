import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/Auth/AuthSlice";
import { CartContext } from "../../context/CartContext";
import { FaBars, FaRegHeart, FaShoppingCart, FaTimes } from "react-icons/fa"; 
import logo from "../../assets/logo.png";

const Navbar = ({ onToggleAdminSidebar, isAdminSidebarOpen }) => {
  const { cartItems } = useContext(CartContext);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile nav
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
        scrolled ? "py-3 bg-emerald-600 shadow-lg" : "py-6 bg-emerald-50/40 backdrop-blur-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-14">
            
            {/* Left: Admin Toggle + Logo */}
            <div className="flex items-center gap-4">
              {userInfo?.role === "admin" && (
                <button
                  onClick={onToggleAdminSidebar}
                  aria-label="Toggle Admin Menu"
                  className={`p-2.5 rounded-xl transition-all duration-300 transform active:scale-90 flex items-center justify-center ${
                    isAdminSidebarOpen 
                      ? "bg-white text-emerald-600 shadow-md rotate-90" 
                      : (scrolled ? "text-white hover:bg-emerald-500" : "text-emerald-900 hover:bg-emerald-100")
                  }`}
                >
                  {isAdminSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                </button>
              )}
              
              <Link to={userInfo?.role === "admin" ? "/admin" : "/"}>
                <img
                  src={logo}
                  alt="logo"
                  className={`h-10 md:h-23 w-auto transition-all duration-500 ${scrolled ? "brightness-0 invert" : ""}`} 
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation Pill */}
            <div className={`hidden lg:flex items-center p-1.5 rounded-full border transition-all ${
                scrolled ? "bg-emerald-700/40 border-emerald-400/30" : "bg-white/60 border-emerald-100"
              }`}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    location.pathname === link.path
                      ? scrolled ? "bg-white text-emerald-600" : "bg-emerald-600 text-white"
                      : scrolled ? "text-emerald-50 hover:text-white" : "text-emerald-800/60 hover:text-emerald-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className={`flex items-center space-x-3 md:space-x-5 text-xl ${scrolled ? "text-white" : "text-emerald-900"}`}>
                <Link to="/wishlist" className="hover:scale-110 transition-transform hidden sm:block"><FaRegHeart /></Link>
                <Link to="/cart" className="relative hover:scale-110 transition-transform">
                  <FaShoppingCart />
                  {cartItems?.length > 0 && (
                    <span className={`absolute -top-2 -right-2 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-2 ${
                      scrolled ? "bg-white text-emerald-600 ring-emerald-600" : "bg-emerald-600 text-white ring-white"
                    }`}>
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                {/* Mobile Menu Toggle (For non-admin nav links) */}
                <button 
                  className="lg:hidden" 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>

              <div className={`pl-2 md:pl-4 border-l ${scrolled ? "border-emerald-500/50" : "border-emerald-100"}`}>
                {userInfo ? (
                  <button
                    onClick={() => setProfileOpen(true)}
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black transition-all ${
                      scrolled ? "bg-white text-emerald-600 border-transparent" : "bg-emerald-600 text-white border-white"
                    }`}
                  >
                    {userInfo?.name?.charAt(0)?.toUpperCase()}
                  </button>
                ) : (
                  <Link to="/login" className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                      scrolled ? "bg-white text-emerald-600" : "bg-emerald-600 text-white"
                    }`}>
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- MOBILE NAVIGATION DROPDOWN --- */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden bg-white ${mobileMenuOpen ? "max-h-64 border-b" : "max-h-0"}`}>
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-emerald-800 hover:text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* --- PROFILE DRAWER --- */}
      <div className={`fixed inset-0 z-[200] ${profileOpen ? "visible" : "invisible"}`}>
        <div 
          className={`absolute inset-0 bg-emerald-950/40 backdrop-blur-sm transition-opacity duration-500 ${profileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setProfileOpen(false)}
        />
        <div className={`absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-2xl p-8 transform transition-transform duration-500 flex flex-col ${profileOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Account</h2>
            <button onClick={() => setProfileOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
              <FaTimes size={20}/>
            </button>
          </div>

          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white text-2xl font-black flex items-center justify-center shadow-lg mb-4">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{userInfo?.name}</h3>
            <p className="text-xs text-slate-400 font-medium">{userInfo?.email}</p>
          </div>

           <nav className="flex-1 space-y-2">
  <Link 
    to="/profile" 
    onClick={() => setProfileOpen(false)} 
    className="block p-4 rounded-xl hover:bg-emerald-50 font-bold text-slate-700 transition-colors"
  >
    👤 Profile Settings
  </Link>
  
  <Link 
    to="/orders" 
    onClick={() => setProfileOpen(false)} 
    className="block p-4 rounded-xl hover:bg-emerald-50 font-bold text-slate-700 transition-colors"
  >
    📦 My Orders
  </Link>

  {/* Added Emoji for Help and styled consistently */}
  <Link 
    to="/help" 
    onClick={() => setProfileOpen(false)} 
    className="block p-4 rounded-xl hover:bg-emerald-50 font-bold text-slate-700 transition-colors"
  >
    ❓ Help & Support
  </Link>
  
  {/* Optional: Add Wishlist here too if you want it in the drawer */}
  <Link 
    to="/wishlist" 
    onClick={() => setProfileOpen(false)} 
    className="block p-4 rounded-xl hover:bg-emerald-50 font-bold text-slate-700 transition-colors"
  >
    ❤️ My Wishlist
  </Link>
</nav>
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-red-50 text-red-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all"
          >
            Logout Account
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
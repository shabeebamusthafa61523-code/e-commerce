import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/Auth/AuthSlice";
import { CartContext } from "../../context/CartContext";
import { FaBars, FaRegHeart, FaShoppingCart, FaTimes, FaSearch, FaMotorcycle } from "react-icons/fa"; 
import logo from "../../assets/logo.png";

// Added onToggleDeliverySidebar and isDeliverySidebarOpen to props
const Navbar = ({ onToggleAdminSidebar, isAdminSidebarOpen, onToggleDeliverySidebar, isDeliverySidebarOpen }) => {
  const { cartItems } = useContext(CartContext);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setSearchTerm("");
      setIsSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

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
        scrolled ? "py-3 bg-emerald-600 shadow-lg" : "py-6 bg-emerald-50/40 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-14">
            
            {/* LEFT: SIDEBAR TOGGLES & LOGO */}
            <div className="flex items-center gap-4">
              
              {/* ADMIN HAMBURGER */}
              {userInfo?.role === "admin" && (
                <button
                  onClick={onToggleAdminSidebar}
                  className={`p-2.5 rounded-xl transition-all duration-300 transform active:scale-90 ${
                    isAdminSidebarOpen 
                      ? "bg-white text-emerald-600 shadow-md rotate-90" 
                      : (scrolled ? "text-white hover:bg-emerald-500" : "text-emerald-900 hover:bg-emerald-100")
                  }`}
                >
                  {isAdminSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                </button>
              )}

              {/* DELIVERY PARTNER HAMBURGER */}
              {userInfo?.role === "delivery" && (
                <button
                  onClick={onToggleDeliverySidebar}
                  className={`p-2.5 rounded-xl transition-all duration-300 transform active:scale-90 ${
                    isDeliverySidebarOpen 
                      ? "bg-white text-emerald-600 shadow-md rotate-90" 
                      : (scrolled ? "text-white hover:bg-emerald-500" : "text-emerald-900 hover:bg-emerald-100")
                  }`}
                >
                  {isDeliverySidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                </button>
              )}
              
              <Link to={userInfo?.role === "admin" ? "/admin" : userInfo?.role === "delivery" ? "/delivery/dashboard" : "/"}>
                <img
                  src={logo}
                  alt="logo"
                  className={`h-10 md:h-20 w-auto transition-all duration-500 ${scrolled ? "brightness-0 invert" : ""}`} 
                />
              </Link>
            </div>

            {/* CENTER: SEARCH & NAV LINKS */}
            <div className="hidden lg:flex items-center gap-4">
              <form 
                onSubmit={handleSearch}
                className={`flex items-center transition-all duration-500 rounded-full border overflow-hidden ${
                  isSearchOpen ? "w-64 px-4" : "w-11"
                } h-11 ${scrolled ? "bg-emerald-700/40 border-emerald-400/30" : "bg-white/60 border-emerald-100 shadow-sm"}`}
              >
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`flex-shrink-0 transition-colors ${scrolled ? "text-emerald-100" : "text-emerald-800"}`}
                >
                  <FaSearch size={16} />
                </button>
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`bg-transparent border-none focus:ring-0 text-xs font-bold transition-all duration-300 outline-none ${
                    isSearchOpen ? "ml-3 w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
                  } ${scrolled ? "placeholder-emerald-200 text-white" : "placeholder-emerald-400 text-emerald-900"}`}
                />
              </form>

              <div className={`flex items-center p-1.5 rounded-full border transition-all ${
                scrolled ? "bg-emerald-700/40 border-emerald-400/30" : "bg-white/60 border-emerald-100 shadow-sm"
              }`}>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                      location.pathname === link.path
                        ? scrolled ? "bg-white text-emerald-600" : "bg-emerald-600 text-white shadow-md"
                        : scrolled ? "text-emerald-50 hover:text-white" : "text-emerald-800/60 hover:text-emerald-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT: ICONS & PROFILE */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className={`flex items-center space-x-3 md:space-x-5 text-xl ${scrolled ? "text-white" : "text-emerald-900"}`}>
                <button className="lg:hidden p-2" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                  <FaSearch size={18} />
                </button>
                
                <Link to="/wishlist" className="hover:scale-110 transition-transform hidden sm:block"><FaRegHeart /></Link>
                
                <Link to="/cart" className="relative hover:scale-110 transition-transform">
                  <FaShoppingCart />
                  {cartItems?.length > 0 && (
                    <span className={`absolute -top-2 -right-2 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-2 animate-bounce ${
                      scrolled ? "bg-white text-emerald-600 ring-emerald-600" : "bg-emerald-600 text-white ring-white"
                    }`}>
                      {cartItems.length}
                    </span>
                  )}
                </Link>

                <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>

              <div className={`pl-2 md:pl-4 border-l ${scrolled ? "border-emerald-500/50" : "border-emerald-100"}`}>
                {userInfo ? (
                  <button
                    onClick={() => setProfileOpen(true)}
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black transition-all transform active:scale-95 ${
                      scrolled ? "bg-white text-emerald-600 border-transparent shadow-md" : "bg-emerald-600 text-white border-white"
                    }`}
                  >
                    {userInfo?.name?.charAt(0)?.toUpperCase()}
                  </button>
                ) : (
                  <Link to="/login" className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                      scrolled ? "bg-white text-emerald-600" : "bg-emerald-600 text-white shadow-lg"
                    }`}>
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH & NAVIGATION (Unchanged) */}
        {/* ... Same as your existing code ... */}
      </nav>

      {/* PROFILE SIDE DRAWER (Add Delivery Logic here) */}
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
            {/* Show Rider Badge if delivery partner */}
            {userInfo?.role === "delivery" && (
               <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-1">
                 <FaMotorcycle /> Certified Rider
               </span>
            )}
            <p className="text-xs text-slate-400 font-medium">{userInfo?.email}</p>
          </div>

          <nav className="flex-1 space-y-2">
            {/* Dynamic links based on role */}
            {userInfo?.role === "delivery" ? (
              <>
               <Link to="/profile" onClick={() => setProfileOpen(false)} className="block p-4 rounded-xl hover:bg-emerald-50 font-bold text-slate-700">
                  👤 Profile Settings
                </Link>
                <Link to="/orders" onClick={() => setProfileOpen(false)} className="block p-4 rounded-xl hover:bg-emerald-50 font-bold text-slate-700">
                  📦 My Orders
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" onClick={() => setProfileOpen(false)} className="block p-4 rounded-xl hover:bg-emerald-50 font-bold text-slate-700">
                  👤 Profile Settings
                </Link>
                <Link to="/orders" onClick={() => setProfileOpen(false)} className="block p-4 rounded-xl hover:bg-emerald-50 font-bold text-slate-700">
                  📦 My Orders
                </Link>
              </>
            )}
            <Link to="/help" onClick={() => setProfileOpen(false)} className="block p-4 rounded-xl hover:bg-emerald-50 font-bold text-slate-700">
              ❓ Help & Support
            </Link>
          </nav>

          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-red-50 text-red-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            Logout Account
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
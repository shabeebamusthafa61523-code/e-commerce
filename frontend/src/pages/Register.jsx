import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, userInfo } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      alert("Password should be at least 6 characters long");
      return;
    }
    dispatch(registerUser(form));
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6 font-sans relative overflow-hidden">
      {/* Aesthetic Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl -mr-24 -mt-24 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl -ml-24 -mb-24 opacity-50"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Join Pacha<span className="text-green-600">.</span>Cart
          </h1>
          <p className="text-slate-500 font-medium mt-2">Experience the finest organic groceries delivered.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200 border border-white space-y-6"
        >
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Rahul Sharma"
                required
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 00000 00000"
                required
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="rahul@example.com"
              required
              onChange={handleChange}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
            />
          </div>

          {/* Address Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Delivery Address</label>
            <textarea
              name="address"
              placeholder="House No, Street, Landmark..."
              required
              rows="2"
              onChange={handleChange}
              className="w-full bg-slate-50 border-none rounded-[1.5rem] p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              onChange={handleChange}
              className="bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              required
              onChange={handleChange}
              className="bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              required
              onChange={handleChange}
              className="col-span-2 md:col-span-1 bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
            />
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
            <div className="relative space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[42px] text-[10px] font-black text-green-600 uppercase tracking-tighter"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                required
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 mt-4 disabled:bg-slate-400"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create My Account"
            )}
          </button>

          <p className="text-center text-slate-400 text-sm font-bold">
            Already have an account?{" "}
            <span
              className="text-green-600 cursor-pointer hover:text-green-700 transition-colors ml-1"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
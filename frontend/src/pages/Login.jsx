import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

 // Inside your login success handler or useEffect
useEffect(() => {
  if (userInfo) {
    if (userInfo.role === 'delivery') {
      navigate('/delivery/dashboard');
    } else if (userInfo.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/home');
    }
  }
}, [userInfo, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl -ml-24 -mt-24 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl -mr-24 -mb-24 opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand Name */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Pacha<span className="text-green-600">.</span>Cart
          </h1>
          <p className="text-slate-500 font-medium mt-2 uppercase text-[10px] tracking-[0.3em]">
            Premium Grocery Delivery
          </p>
        </div>

        <div className="bg-white rounded-[3.5rem] p-10 md:p-12 shadow-2xl shadow-slate-200 border border-white">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm font-medium mb-8">Please enter your details to sign in.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 animate-shake">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest cursor-pointer hover:text-green-700">
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 mt-4 disabled:bg-slate-400"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-bold">
              Don’t have an account?{" "}
              <span
                className="text-green-600 cursor-pointer hover:text-green-700 transition-colors ml-1"
                onClick={() => navigate("/register")}
              >
                Create Account
              </span>
            </p>
          </div>
        </div>

        {/* Footer Link */}
       
      </div>
    </div>
  );
}
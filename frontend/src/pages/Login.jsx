import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  
  // --- FORGOT PASSWORD STATES ---
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetData, setResetData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [resetLoading, setResetLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  // --- Password Reset Logic ---
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    
    if (resetData.newPassword !== resetData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setResetLoading(true);
    try {
      // Calling your direct reset endpoint
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password-direct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetData.email,
          password: resetData.newPassword
        }),
      });

      if (res.ok) {
        toast.success("Password updated! Please sign in.");
        setIsForgotModalOpen(false);
        setResetData({ email: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update password.");
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    } finally {
      setResetLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'delivery') navigate('/delivery/dashboard');
      else if (userInfo.role === 'admin') navigate('/admin');
      else navigate('/home');
    }
  }, [userInfo, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 font-sans relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl -ml-24 -mt-24 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl -mr-24 -mb-24 opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Pacha<span className="text-green-600">.</span>Cart
          </h1>
          <p className="text-slate-500 font-medium mt-2 uppercase text-[10px] tracking-[0.3em]">Premium Grocery Delivery</p>
        </div>

        <div className="bg-white rounded-[3.5rem] p-10 md:p-12 shadow-2xl shadow-slate-200 border border-white">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm font-medium mb-8">Please enter your details to sign in.</p>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold animate-shake">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <span onClick={() => setIsForgotModalOpen(true)} className="text-[10px] font-black text-green-600 uppercase tracking-widest cursor-pointer hover:text-green-700">Forgot?</span>
              </div>
              <input type="password" name="password" required value={form.password} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl mt-4 active:scale-[0.98] transition-all disabled:bg-slate-400">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-bold">Don’t have an account? <span className="text-green-600 cursor-pointer hover:text-green-700 ml-1" onClick={() => navigate("/register")}>Create Account</span></p>
          </div>
        </div>
      </div>

      {/* --- FORGOT PASSWORD MODAL --- */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={() => setIsForgotModalOpen(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recover Account</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Identity Verification</p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Registered Email</label>
                <input type="email" name="email" required placeholder="name@example.com" value={resetData.email} onChange={handleResetChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Password</label>
                <input type="password" name="newPassword" required placeholder="••••••••" value={resetData.newPassword} onChange={handleResetChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirm Password</label>
                <input type="password" name="confirmPassword" required placeholder="••••••••" value={resetData.confirmPassword} onChange={handleResetChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" disabled={resetLoading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 transition active:scale-95 disabled:bg-slate-400">
                  {resetLoading ? "Updating..." : "Reset Password"}
                </button>
                <button type="button" onClick={() => setIsForgotModalOpen(false)} className="w-full py-2 font-black text-[10px] uppercase tracking-widest text-slate-400">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { FaMapMarkerAlt, FaCreditCard, FaTruck, FaCheckCircle } from "react-icons/fa";
import {
  addAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "../features/address/addressSlice";

export default function Checkout() {
  const { cartItems: cart = [], clearCart } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { addresses } = useSelector((state) => state.address);
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [addressForm, setAddressForm] = useState({
    id: null, fullName: "", phone: "", street: "", city: "", pincode: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSaveAddress = () => {
    if (Object.values(addressForm).some(val => val === "" && val !== addressForm.id)) {
      alert("Please fill all fields");
      return;
    }
    editMode ? dispatch(updateAddress(addressForm)) : dispatch(addAddress({ ...addressForm, id: Date.now() }));
    resetForm();
  };

  const handleEdit = (addr) => {
    setAddressForm(addr);
    setEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setAddressForm({ id: null, fullName: "", phone: "", street: "", city: "", pincode: "" });
    setEditMode(false);
    setShowModal(false);
  };

  const handlePlaceOrder = async () => {
    if (!defaultAddress) return alert("Please add a delivery address");
const selectedAddress = {
    fullName: defaultAddress.fullName,
    phone: defaultAddress.phone,
    street: defaultAddress.street,
    city: defaultAddress.city,
    pincode: defaultAddress.pincode
  };
    if (paymentMethod === "razorpay") {
      await handleRazorpayPayment(selectedAddress);
    } else {
      await handleCODOrder(selectedAddress);
    }
  };

  const handleCODOrder = async (address) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        items: cart.map(i => ({ product: i._id, quantity: i.quantity })),
        totalAmount: total,
shippingAddress: address,
        paymentMethod: "COD",
      }, { headers: { Authorization: `Bearer ${userInfo.token}` } });

      finishOrder();
    } catch (error) {
      alert("Order failed: " + error.message);
    } finally { setLoading(false); }
  };

  const handleRazorpayPayment = async (address) => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payment/create-order`, 
        { items: cart.map(i => ({ product: i._id, quantity: i.quantity })) },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        name: "Pacha.Cart",
       handler: async (res) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, { // Added /api/orders
      ...res, 
shippingAddress: address,
      paymentMethod: "Razorpay",
      totalAmount: total,
      items: cart.map(i => ({ product: i._id, quantity: i.quantity }))
    }, { headers: { Authorization: `Bearer ${userInfo?.token}` } });
    finishOrder();
  } catch (error) {
    alert("Payment verification failed on server");
  }
},
        theme: { color: "#10b981" }
      };
      new window.Razorpay(options).open();
    } catch (e) { alert("Payment Initiation Failed"); }
    finally { setLoading(false); }
  };

  const finishOrder = () => {
    clearCart();
    setShowSuccessModal(true);
    setTimeout(() => navigate("/orders"), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
        
        {/* LEFT: Checkout Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Checkout</h1>
            <p className="text-slate-500 font-medium">Complete your organic haul.</p>
          </div>

          {/* Address Section */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt />
                </div>
                <h2 className="text-xl font-black text-slate-900">Delivery Address</h2>
              </div>
              <button onClick={() => setShowModal(true)} className="text-xs font-black uppercase tracking-widest text-green-600 hover:text-green-700">
                + Add New
              </button>
            </div>

            <div className="space-y-4">
              {addresses.map((addr) => (
                <div 
                  key={addr.id} 
                  onClick={() => dispatch(setDefaultAddress(addr.id))}
                  className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${addr.isDefault ? "border-green-500 bg-green-50/30" : "border-slate-50 bg-slate-50/50"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-slate-900">{addr.fullName}</p>
                      <p className="text-sm text-slate-500 mt-1">{addr.street}, {addr.city} - {addr.pincode}</p>
                      <p className="text-sm text-slate-500">{addr.phone}</p>
                    </div>
                    {addr.isDefault && <FaCheckCircle className="text-green-500" />}
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(addr); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); dispatch(deleteAddress(addr.id)); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Section */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <FaCreditCard />
              </div>
              <h2 className="text-xl font-black text-slate-900">Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "razorpay", label: "Online Payment", sub: "Cards, UPI, NetBanking", icon: <FaCreditCard /> },
                { id: "cod", label: "Cash on Delivery", sub: "Pay when you receive", icon: <FaTruck /> }
              ].map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 ${paymentMethod === method.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-50 bg-slate-50/50 text-slate-600"}`}
                >
                  <div className={`text-xl ${paymentMethod === method.id ? "text-green-400" : "text-slate-400"}`}>{method.icon}</div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest">{method.label}</p>
                    <p className={`text-[10px] ${paymentMethod === method.id ? "text-white/60" : "text-slate-400"}`}>{method.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl lg:sticky lg:top-8">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Order Summary</h3>
            <div className="space-y-6 mb-10 overflow-y-auto max-h-[300px] pr-2">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-50 pt-8 space-y-4">
              <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-lg font-black text-slate-900">Total</span>
                <span className="text-4xl font-black text-green-600 tracking-tighter">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={loading || cart.length === 0}
              onClick={handlePlaceOrder}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl mt-10 hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-200 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS (Framer Motion) --- */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 mb-8">{editMode ? "Update Address" : "New Address"}</h2>
              <div className="space-y-4">
                {["fullName", "phone", "street", "city", "pincode"].map((field) => (
                  <input
                    key={field} type="text" placeholder={field.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    value={addressForm[field]}
                    onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 font-bold outline-none text-sm"
                  />
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={resetForm} className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest text-xs">Cancel</button>
                <button onClick={handleSaveAddress} className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-white z-[100] flex items-center justify-center p-6 text-center">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="max-w-sm">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
                <FaCheckCircle />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Order Placed!</h2>
              <p className="text-slate-500 font-medium mb-10 text-lg">Your organic treasures are being prepared for delivery.</p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }} className="bg-green-500 h-full" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Redirecting to your orders...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
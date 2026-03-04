import React, { useState } from "react";
import { FaPaperPlane, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaCopy } from "react-icons/fa"; // Added FaCopy
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  // --- NEW: Copy Email Logic ---
  const copyEmail = (e) => {
    e.preventDefault(); // Prevents the mailto from firing when clicking copy
    navigator.clipboard.writeText("support@pachacart.com");
    toast.success("Email copied to clipboard!");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, formData);
      toast.success("Message sent! We'll be in touch soon.");
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-3 block">
            Get In Touch
          </span>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
            How can we help you?
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Have a question about sourcing, orders, or a custom request? 
            Our team is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- LEFT: THE CONTACT FORM --- */}
          <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                  <input
                    name="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 appearance-none"
                >
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Sourcing & Quality</option>
                  <option>Bulk Pricing</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Your Message</label>
                <textarea
                  name="message"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your requirements..."
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-800 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                <FaPaperPlane className="text-sm" />
                Send Message
              </button>
            </form>
          </div>

          {/* --- RIGHT: DIRECT CONTACT CARDS --- */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-2 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Direct Connect</h2>
                <p className="text-slate-400 text-sm font-medium mb-8">Skip the queue. Connect with our experts instantly.</p>

                <div className="space-y-4">
                  {/* WhatsApp Card */}
                  <a
                    href="https://wa.me/918136852467"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 rounded-[2rem] bg-slate-50 hover:bg-green-600 transition-all duration-500 border border-transparent hover:border-green-400"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <FaWhatsapp /> 
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-green-600 uppercase tracking-widest group-hover:text-green-100">Live Now</span>
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse group-hover:bg-white"></span>
                        </div>
                        <p className="font-black text-slate-900 group-hover:text-white transition-colors">WhatsApp Chat</p>
                        <p className="text-xs text-slate-400 group-hover:text-green-100 transition-colors">+91 8136852467</p>
                      </div>
                    </div>
                  </a>

                  {/* --- UPDATED EMAIL CARD --- */}
                  <div className="relative group">
                    <a
                      href="mailto:support@pachacart.com?subject=Inquiry from Website&body=Hi Pachacart Team,"
                      className="group block p-6 rounded-[2rem] bg-slate-50 hover:bg-slate-900 transition-all duration-500 border border-transparent hover:border-slate-700"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                          <FaEnvelope />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block group-hover:text-slate-300">
                              Official Support
                            </span>
                            {/* Copy Fallback Button */}
                            <button 
                              onClick={copyEmail}
                              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                              title="Copy Email"
                            >
                              <FaCopy size={12} />
                            </button>
                          </div>
                          <p className="font-black text-slate-900 group-hover:text-white transition-colors">
                            Email Us Directly
                          </p>
                          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                            support@pachacart.com
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Location Card */}
                  <div className="p-6 rounded-[2rem] border border-slate-100 mt-4">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center text-xl shrink-0">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">Headquarters</span>
                        <p className="font-bold text-slate-800 text-sm leading-relaxed">
                          Daliya KPees, Malappuram,<br /> Kerala, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="px-8 py-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
              <div className="text-2xl">🌱</div>
              <p className="text-xs font-bold text-emerald-800 leading-tight">
                Your data is encrypted and handled according to our strict Organic Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
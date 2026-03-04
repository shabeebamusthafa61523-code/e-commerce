import { useState } from "react";

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I track my order?",
      answer: "You can track your order in real-time from your account dashboard under 'My Orders'. Once dispatched, a live tracking link will also be sent to your registered email and via SMS.",
    },
    {
      question: "How do I return a product?",
      answer: "Quality is our priority, but if you're not satisfied, go to 'My Orders', select the item, and click 'Request Return'. For perishables, please notify us within 24 hours of delivery.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We support all major payment gateways including UPI (Google Pay, PhonePe), Credit/Debit cards, Net Banking, and secure Cash on Delivery (COD) for most locations.",
    },
    {
      question: "How long does delivery take?",
      answer: "We pride ourselves on speed. Local deliveries within Kochi usually arrive within 4-6 hours. Standard shipping outside the city takes 2-3 business days.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">
            Support Center
          </span>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
            How can we help<span className="text-green-600">?</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Find quick answers to your questions or reach out to our dedicated team.
          </p>
        </div>

        {/* FAQ Container */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                openIndex === index 
                ? "border-green-200 shadow-xl shadow-green-600/5" 
                : "border-gray-100 shadow-sm hover:border-slate-200"
              }`}
            >
              <button
                className="w-full text-left p-8 flex justify-between items-center outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className={`font-bold text-lg transition-colors duration-300 ${
                  openIndex === index ? "text-green-700" : "text-slate-800"
                }`}>
                  {faq.question}
                </h3>
                <span className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index ? "bg-green-600 text-white rotate-45" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>

              <div className={`transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="px-8 pb-8">
                  <div className="w-full h-px bg-slate-50 mb-6" />
                  <p className="text-slate-500 leading-relaxed font-medium text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support CTA */}
        <div className="mt-16 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-900 text-white rounded-[3rem] p-10 md:p-14 text-center overflow-hidden shadow-2xl">
             {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
                Still have questions? 💬
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto font-medium">
                Our support specialists are standing by to ensure your Pacha.Cart experience is perfect.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-600/20">
                  Chat With Us Now
                </button>
                <button className="bg-white/10 text-white px-10 py-4 rounded-2xl font-black hover:bg-white/20 transition-all active:scale-95 border border-white/10 backdrop-blur-md">
                  Visit Contact Page
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
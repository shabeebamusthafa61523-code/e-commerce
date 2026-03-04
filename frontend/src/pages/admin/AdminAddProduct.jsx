import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [categories, setCategories] = useState([
    "vegetables", "fruits", "dairy", "bakery", "beverages",
    "snacks", "grains", "spices", "oils", "frozen Foods",
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    discountPrice: "", // Added for Flash Sale
    category: "",
    stock: "",
    description: "",
    nutritionInfo: "",
    isOrganic: false,
    isFlashSale: false, // Added for Flash Sale control
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append all fields to FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: data,
      });

      if (res.ok) {
        alert("Product added to catalog!");
        setFormData({
          name: "", brand: "", price: "", discountPrice: "",
          category: "", stock: "", description: "",
          nutritionInfo: "", isOrganic: false, isFlashSale: false, image: null,
        });
        document.getElementById("imageInput").value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <AdminSidebar />

      <div className="flex-1 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 w-full max-w-2xl h-fit">
          <header className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add New Product</h2>
            <p className="text-slate-500 font-medium mt-1">Fill in the details to update your inventory</p>
          </header>

          <form onSubmit={submitHandler} className="space-y-6">
            
            {/* Group 1: Identity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400 ml-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Red Grapes" className="w-full bg-slate-50 border-none p-3 rounded-2xl focus:ring-2 focus:ring-green-500 transition" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400 ml-1">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. FreshFarm" className="w-full bg-slate-50 border-none p-3 rounded-2xl focus:ring-2 focus:ring-green-500 transition" />
              </div>
            </div>

            {/* Group 2: Pricing & Deals (CRITICAL FOR FLASH SALE) */}
            <div className="p-6 bg-green-50/50 rounded-[2rem] border border-green-100 space-y-4">
              <p className="text-xs font-black text-green-700 uppercase tracking-widest">Pricing & Sale Logic</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 ml-1">Original Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="500" className="w-full bg-white border-none p-3 rounded-xl focus:ring-2 focus:ring-green-500 shadow-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-red-600 ml-1">Discount Price (₹)</label>
                  <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} placeholder="450" className="w-full bg-white border-none p-3 rounded-xl focus:ring-2 focus:ring-red-500 shadow-sm" />
                </div>
              </div>
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-red-50 transition border border-transparent hover:border-red-100 shadow-sm">
                <input type="checkbox" name="isFlashSale" checked={formData.isFlashSale} onChange={handleChange} className="w-5 h-5 accent-red-600" />
                <span className="text-sm font-bold text-slate-700">🔥 Feature in Flash Sale Sidebar</span>
              </label>
            </div>

            {/* Group 3: Category & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400 ml-1">Category</label>
                <div className="flex gap-2">
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border-none p-3 rounded-2xl focus:ring-2 focus:ring-green-500 transition appearance-none" required>
                    <option value="">Select...</option>
                    {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                  </select>
                  <button type="button" onClick={() => setShowModal(true)} className="bg-slate-900 text-white w-12 rounded-2xl hover:bg-slate-800 transition shadow-lg">+</button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400 ml-1">Stock Quantity</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="100" className="w-full bg-slate-50 border-none p-3 rounded-2xl focus:ring-2 focus:ring-green-500 transition" required />
              </div>
            </div>

            {/* Group 4: Details */}
            <div className="space-y-4">
               <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Product Description..." className="w-full bg-slate-50 border-none p-4 rounded-[1.5rem] focus:ring-2 focus:ring-green-500 transition h-24" required />
               <input id="imageInput" type="file" onChange={handleImageChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" required />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" name="isOrganic" checked={formData.isOrganic} onChange={handleChange} className="w-5 h-5 accent-green-600" />
                <span className="text-sm font-bold text-slate-600 group-hover:text-green-600 transition">🌿 Organic Certified</span>
              </label>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-green-500 transition-all shadow-xl shadow-green-600/20 active:scale-[0.98]">
              Publish Product
            </button>
          </form>
        </div>
      </div>

      {/* CATEGORY MODAL - Kept your logic, updated style */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[200] p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-slate-900 mb-2">New Category</h3>
            <p className="text-slate-500 text-sm mb-6">Create a custom department for your store.</p>
            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category name..." className="w-full bg-slate-50 border-none p-4 rounded-2xl mb-6 focus:ring-2 focus:ring-green-500" />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
              <button onClick={() => {
                if (newCategory.trim()) {
                  setCategories([...categories, newCategory]);
                  setFormData({ ...formData, category: newCategory });
                  setNewCategory("");
                  setShowModal(false);
                }
              }} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddProduct;
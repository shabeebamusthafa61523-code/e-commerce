import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateProduct, fetchProducts } from "../../features/products/ProductSlice";
import AdminSidebar from "../../components/admin/AdminSidebar";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.product);
  const existingProduct = products.find((p) => p._id === id);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    nutritionInfo: "",
    isOrganic: false,
    image: null,
  });

  const [categories, setCategories] = useState([
    "vegetables", "fruits", "dairy", "bakery", "beverages", 
    "snacks", "grains", "spices", "oils", "frozen Foods",
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || "",
        brand: existingProduct.brand || "",
        price: existingProduct.price || "",
        category: existingProduct.category || "",
        stock: existingProduct.stock || "",
        description: existingProduct.description || "",
        nutritionInfo: existingProduct.nutritionInfo || "",
        isOrganic: existingProduct.isOrganic || false,
        image: null,
      });
      // Set existing image preview if available
      if (existingProduct.image) {
        const img = Array.isArray(existingProduct.image) ? existingProduct.image[0] : existingProduct.image;
        setPreview(img.startsWith('http') ? img : `${import.meta.env.VITE_API_BASE_URL}/uploads/${img.split(/[\\/]/).pop()}`);
      }
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && !formData[key]) return;
      data.append(key, formData[key]);
    });

    try {
      await dispatch(updateProduct({ id, updatedData: data })).unwrap();
      dispatch(fetchProducts());
      navigate("/admin/products");
    } catch (err) {
      alert("Update failed: " + err);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">Inventory Management</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Edit Product</h1>
          </div>

          <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Media & Highlights */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Product Image</label>
                <div className="relative group mx-auto w-48 h-48 mb-6">
                  <img 
                    src={preview || "https://placehold.co/400?text=No+Image"} 
                    className="w-full h-full object-cover rounded-[2rem] border-4 border-slate-50 shadow-inner"
                    alt="Preview"
                  />
                  <label className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] cursor-pointer text-white text-xs font-bold">
                    Change Photo
                    <input type="file" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
                
                <label className="flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleChange}
                    className="w-5 h-5 accent-green-600"
                  />
                  <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">Organic Certified</span>
                </label>
              </div>
            </div>

            {/* Right Column: Details Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Product Name</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 font-bold text-slate-800 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Brand</label>
                    <input
                      type="text" name="brand" value={formData.brand} onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 font-bold text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Price (₹)</label>
                    <input
                      type="number" name="price" value={formData.price} onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 font-bold text-slate-800 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</label>
                    <div className="flex gap-2">
                      <select
                        name="category" value={formData.category} onChange={handleChange}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 font-bold text-slate-800 outline-none appearance-none"
                        required
                      >
                        <option value="">Select</option>
                        {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                      </select>
                      <button 
                        type="button" onClick={() => setShowModal(true)}
                        className="bg-slate-900 text-white px-5 rounded-2xl hover:bg-slate-800 transition-colors font-bold"
                      >+</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Stock Level</label>
                    <input
                      type="number" name="stock" value={formData.stock} onChange={handleChange}
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 font-bold text-slate-800 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-green-500 font-bold text-slate-800 outline-none min-h-[100px] resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mt-4"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* --- CATEGORY MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-6">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-white">
            <h3 className="text-xl font-black text-slate-900 mb-6">New Category</h3>
            <input
              type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Superfoods"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 mb-6 focus:ring-2 focus:ring-green-500 font-bold outline-none"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-bold">Cancel</button>
              <button 
                onClick={() => {
                  if (newCategory.trim() && !categories.includes(newCategory)) {
                    setCategories([...categories, newCategory]);
                    setFormData({...formData, category: newCategory});
                    setNewCategory("");
                    setShowModal(false);
                  }
                }}
                className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct; 
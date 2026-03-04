import { useEffect, useState } from "react"; // Added useState
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../features/products/productSlice";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../../components/admin/AdminSidebar";

const ManageProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [flashPrice, setFlashPrice] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product permanently?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch (err) {
        alert("Failed to delete: " + err);
      }
    }
  };

  // Open modal logic
  const handleFlashClick = (product) => {
    if (product.isFlashSale) {
      // If already active, just turn it off immediately
      toggleFlashSale(product._id, product.isFlashSale, product.price);
    } else {
      // If not active, open modal to set new price
      setSelectedProduct(product);
      setFlashPrice(Math.floor(product.price * 0.9)); // Default to 10% off
      setIsModalOpen(true);
    }
  };

  const toggleFlashSale = async (productId, currentStatus, newPrice) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        { 
          isFlashSale: !currentStatus,
          discountPrice: !currentStatus ? newPrice : 0 
        },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      setIsModalOpen(false);
      dispatch(fetchProducts());
    } catch (error) {
      alert("Failed to update flash status");
    }
  };

  const getImageUrl = (p) => {
    const rawImage = p.image || (p.images && p.images[0]);
    if (!rawImage) return "https://placehold.co/150?text=No+Image";
    const pathString = Array.isArray(rawImage) ? rawImage[0] : rawImage;
    return pathString.startsWith("http") ? pathString : `http://localhost:5000/uploads/${pathString.split(/[\\/]/).pop()}`;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">Catalog</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Inventory</h1>
          </div>
          <Link to="/admin/add-product" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-200">
            + Create New Product
          </Link>
        </div>

        {/* Product List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Scanning Catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {products.map((p) => (
              <div key={p._id} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col lg:flex-row items-center gap-8">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <img src={getImageUrl(p)} alt={p.name} className="w-full h-full object-cover rounded-[1.5rem] border-4 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-2">
                    <h3 className="text-xl font-black text-slate-900 leading-none">{p.name}</h3>
                    <div className="flex gap-2 justify-center lg:justify-start">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-50 rounded-lg">{p.category}</span>
                        {p.isFlashSale && (
                             <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest px-2 py-1 bg-amber-50 rounded-lg border border-amber-100">⚡ Flash Sale (₹{p.discountPrice})</span>
                        )}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm font-medium line-clamp-1 max-w-md">{p.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleFlashClick(p)}
                    className={`flex items-center gap-1 px-4 py-3 rounded-xl text-xs font-black uppercase transition-all ${
                      p.isFlashSale 
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-200" 
                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    ⚡ {p.isFlashSale ? "Active" : "Flash"}
                  </button>

                  <Link to={`/admin/products/edit/${p._id}`} className="bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="bg-red-50 text-red-500 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FLASH SALE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">⚡</div>
              <h2 className="text-2xl font-black text-slate-900">Activate Flash Sale</h2>
              <p className="text-slate-400 font-medium mt-2">Set a special discounted price for {selectedProduct?.name}</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-slate-400">Original Price</span>
                <span className="text-slate-900">₹{selectedProduct?.price}</span>
              </div>

              <div className="relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Flash Sale Price (₹)</label>
                <input 
                  type="number" 
                  value={flashPrice}
                  onChange={(e) => setFlashPrice(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-xl focus:ring-2 focus:ring-amber-500 transition-all"
                  placeholder="Enter lower price..."
                />
                {flashPrice >= selectedProduct?.price && (
                    <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-tight">Price must be lower than ₹{selectedProduct?.price}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={!flashPrice || flashPrice >= selectedProduct?.price}
                  onClick={() => toggleFlashSale(selectedProduct._id, false, flashPrice)}
                  className="flex-1 bg-amber-500 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  Activate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
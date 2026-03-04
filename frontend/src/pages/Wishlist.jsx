import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/product/ProductCard";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-green-600 font-black text-xs uppercase tracking-[0.3em] mb-2 block">
              Saved Items
            </span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              My Wishlist<span className="text-green-600">.</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlist.length === 0 ? (
          /* Empty State - High End Feel */
          <div className="bg-white rounded-[3.5rem] border border-slate-100 p-16 md:p-24 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
              🤍
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Your wishlist is empty</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">
              Save your favorite organic finds here and grab them whenever you're ready to cook.
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-slate-900 text-white px-10 py-4 rounded-2xl font-black transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-200"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div key={product._id} className="group relative">
                {/* We wrap the ProductCard to ensure it matches the new theme's spacing */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Wishlist Tip Section */}
        {wishlist.length > 0 && (
          <div className="mt-20 p-8 bg-green-600 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-green-900/20">
            <div>
              <h4 className="text-xl font-black mb-1">Ready to checkout? 🛒</h4>
              <p className="text-green-100 font-medium">Move your favorites to the cart and enjoy fresh delivery.</p>
            </div>
            <Link 
              to="/cart" 
              className="bg-white text-green-700 px-8 py-3 rounded-xl font-black hover:bg-green-50 transition-colors"
            >
              Go to Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
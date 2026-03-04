import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleWishlist = (e) => {
    e.stopPropagation(); // 🔥 prevents navigation

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="relative bg-white rounded-xl shadow-md hover:shadow-xl p-4 transition duration-300 cursor-pointer overflow-hidden"
    >
      {/* ❤️ Heart Button */}
      <button
        onClick={toggleWishlist}
        className="absolute bottom-27 right-2 text-xl text-red-500 z-10"
      >
        {isInWishlist(product._id) ? <FaHeart /> : <FaRegHeart />}
      </button>

      {/* Image */}
  <img
  src={
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png"
  }
  alt={product.name}
  className="h-48 w-full object-cover rounded-lg"
/>

      {/* Discount badge */}
      {product.discount && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
          {product.discount}% OFF
        </span>
      )}

      <div className="mt-4">
        <h3 className="font-semibold text-gray-800 text-lg">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mb-2">
          {product.brand}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-green-600 font-bold text-lg">
            ₹{product.price}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
              navigate("/cart");
            }}
            className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
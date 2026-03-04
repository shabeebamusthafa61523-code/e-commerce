import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartSummary() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-white p-4 rounded-xl border space-y-3">
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

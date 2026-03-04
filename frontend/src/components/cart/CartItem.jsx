import { useCart } from "../../context/CartContext";

export default function CartItem({ item }) {
  const { removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <h4>{item.name}</h4>
      <p>₹{item.price}</p>
      <button onClick={() => removeFromCart(item._id)}>Remove</button>
    </div>
  );
}

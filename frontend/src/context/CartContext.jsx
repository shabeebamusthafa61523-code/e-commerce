import { createContext, useState, useEffect } from "react";
import { useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ADD TO CART
const addToCart = (product, qty = 1) => {
  setCartItems((prev) => {
    const exist = prev.find((item) => item._id === product._id);

    if (exist) {
      return prev.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + qty }
          : item
      );
    } else {
      // Force image to be string
      let image = product.images;
      if (Array.isArray(image)) {
        // If it's nested array, flatten one level
        image = Array.isArray(image[0]) ? image[0][0] : image[0];
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
// CartContext.js - addToCart
image: Array.isArray(product.images)
        ? Array.isArray(product.images[0])
          ? product.images[0][0]  // nested array
          : product.images[0]
        : product.images,
                  quantity: qty,
        },
      ];
    }
  });
};
  // REMOVE ITEM
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // UPDATE QTY
  const updateQuantity = (id, qty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // CLEAR CART
  const clearCart = () => {
    setCartItems([]);
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  return useContext(CartContext);
};

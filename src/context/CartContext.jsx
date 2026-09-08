import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cartService } from "../services/shop.service";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [total, setTotal] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      setTotal(0);
      return;
    }
    try {
      const { data } = await cartService.get();
      setCart(data.cart);
      setTotal(data.total);
    } catch {
      // silent — cart badge just stays at last known state
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, total, itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

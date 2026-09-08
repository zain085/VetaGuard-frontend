import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { cartService } from "../../services/shop.service";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function Cart() {
  useDocumentTitle("Your Cart");
  const { user, loading: authLoading } = useAuth();
  const { cart, total, refreshCart } = useCart();
  const [busyId, setBusyId] = useState(null);

  const changeQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    setBusyId(productId);
    try {
      await cartService.updateItem(productId, quantity);
      await refreshCart();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update quantity");
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (productId) => {
    setBusyId(productId);
    try {
      await cartService.removeItem(productId);
      await refreshCart();
      toast.success("Item removed");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to remove item");
    } finally {
      setBusyId(null);
    }
  };

  if (authLoading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner className="h-8 w-8" /></div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6 lg:px-8">
        <FiShoppingCart className="mx-auto h-10 w-10 text-text-muted" />
        <p className="mt-4 text-text-muted">
          Please <Link to="/login" className="font-medium text-primary hover:underline">log in</Link> to view your cart.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Your Cart</h1>

      {!cart.items || cart.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FiShoppingCart}
            title="Your cart is empty"
            description="Browse the shop to find something for your pet."
            action={<Link to="/shop" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">Go to shop</Link>}
          />
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition">
                <div className="flex-1">
                  <Link to={`/shop/${item.product.slug}`} className="font-medium text-text hover:text-primary">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-text-muted">${item.priceSnapshot} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeQuantity(item.product._id, item.quantity - 1)}
                    disabled={busyId === item.product._id}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text hover:border-primary"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm text-text">{item.quantity}</span>
                  <button
                    onClick={() => changeQuantity(item.product._id, item.quantity + 1)}
                    disabled={busyId === item.product._id}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text hover:border-primary"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>
                <p className="w-16 text-right text-sm font-semibold text-text">
                  ${(item.priceSnapshot * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.product._id)}
                  disabled={busyId === item.product._id}
                  className="rounded-md p-2 text-text-muted hover:bg-bg hover:text-danger"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-surface p-4 theme-transition">
            <span className="font-semibold text-text">Total</span>
            <span className="text-xl font-bold text-text">${total.toFixed(2)}</span>
          </div>
          <p className="mt-3 text-xs text-text-muted">
            Checkout and payment are outside this platform's current scope — this cart is for browsing and planning your order.
          </p>
        </>
      )}
    </div>
  );
}

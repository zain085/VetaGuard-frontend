import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShoppingBag, FiStar } from "react-icons/fi";
import { productService, cartService } from "../../services/shop.service";
import { reviewService } from "../../services/care.service";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ReviewSection from "../../components/reviews/ReviewSection";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useDocumentTitle(product ? product.name : "Product");

  useEffect(() => {
    productService
      .getBySlug(slug)
      .then(({ data }) => setProduct(data.product))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load product"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    setAdding(true);
    try {
      await cartService.addItem(product._id, quantity);
      await refreshCart();
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner className="h-8 w-8" /></div>;
  }
  if (!product) return null;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="flex h-72 items-center justify-center overflow-hidden rounded-lg border border-border bg-bg">
          {product.images?.[0]?.url ? (
            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <FiShoppingBag className="h-16 w-16 text-text-muted" />
          )}
        </div>
        <div>
          <p className="text-xs text-text-muted">{product.category?.name}</p>
          <h1 className="mt-1 text-2xl font-semibold text-text">{product.name}</h1>
          {product.brand && <p className="mt-1 text-sm text-text-muted">by {product.brand}</p>}
          {product.rating > 0 && (
            <p className="mt-2 flex items-center gap-1 text-sm text-text-muted">
              <FiStar className="text-warning" /> {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </p>
          )}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-text">${product.price}</span>
            {hasDiscount && <span className="text-sm text-text-muted line-through">${product.compareAtPrice}</span>}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {product.description && <p className="mt-4 text-sm text-text-muted">{product.description}</p>}

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock || 1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              disabled={product.stock === 0}
            />
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="flex-1 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {product.stock === 0 ? "Out of stock" : adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          {!user && (
            <p className="mt-3 text-xs text-text-muted">
              <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link> to add items to your cart.
            </p>
          )}
        </div>
      </div>

      <ReviewSection
        fetchReviews={() => reviewService.getProductReviews(product._id)}
        submitReview={(payload) => reviewService.createProductReview({ product: product._id, ...payload })}
        canReview={!!user}
      />
    </div>
  );
}

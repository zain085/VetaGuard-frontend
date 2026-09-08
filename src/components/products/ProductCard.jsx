import { Link } from "react-router-dom";
import { FiShoppingBag, FiStar } from "react-icons/fi";

export default function ProductCard({ product }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="block overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-shadow hover:shadow-md theme-transition"
    >
      <div className="flex h-40 items-center justify-center bg-bg">
        {product.images?.[0]?.url ? (
          <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <FiShoppingBag className="h-10 w-10 text-text-muted" />
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-text-muted">{product.category?.name}</p>
        <h3 className="mt-0.5 font-semibold text-text">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-text">${product.price}</span>
            {hasDiscount && <span className="text-xs text-text-muted line-through">${product.compareAtPrice}</span>}
          </div>
          {product.rating > 0 && (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <FiStar className="text-warning" size={12} /> {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        {product.stock === 0 && <p className="mt-1 text-xs font-medium text-danger">Out of stock</p>}
      </div>
    </Link>
  );
}

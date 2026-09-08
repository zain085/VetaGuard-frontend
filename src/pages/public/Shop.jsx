import { useEffect, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import { productService, categoryService } from "../../services/shop.service";
import ProductCard from "../../components/products/ProductCard";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-rating", label: "Top Rated" },
];

export default function Shop() {
  useDocumentTitle("Shop");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", search: "", sort: "-createdAt" });

  useEffect(() => {
    categoryService.list().then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const load = async (params) => {
    setLoading(true);
    try {
      const { data } = await productService.list(params);
      setProducts(data.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ sort: filters.sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sort]);

  const onSubmit = (e) => {
    e.preventDefault();
    const params = { sort: filters.sort };
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    load(params);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Shop</h1>
      <p className="mt-1 text-sm text-text-muted">Food, grooming, toys, and essentials for your pet.</p>
      <p className="mt-1 text-xs text-text-muted">
        Note: checkout and delivery are outside this platform's current scope — browse and build a cart here.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:w-48"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:w-48"
        >
          {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <button type="submit" className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          Search
        </button>
      </form>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : products.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={FiShoppingBag} title="No products found" description="Try adjusting your search or filters." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}

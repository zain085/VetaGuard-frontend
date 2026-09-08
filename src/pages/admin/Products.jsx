import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { productService, categoryService } from "../../services/shop.service";
import { adminProductService, adminCategoryService } from "../../services/admin.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", brand: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([productService.list({ limit: 50 }), categoryService.list()])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
        if (categoriesRes.data.categories[0] && !form.category) {
          setForm((f) => ({ ...f, category: categoriesRes.data.categories[0]._id }));
        }
      })
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await adminCategoryService.create({ name: newCategory.trim() });
      toast.success("Category added");
      setNewCategory("");
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to add category");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminProductService.create({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      });
      toast.success("Product created");
      setForm({ name: "", category: categories[0]?._id || "", price: "", stock: "", brand: "", description: "" });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (product) => {
    try {
      if (product.isActive) {
        await adminProductService.delete(product._id);
      } else {
        await adminProductService.update(product._id, { isActive: true });
      }
      toast.success(product.isActive ? "Product deactivated" : "Product reactivated");
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update product");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Products</h1>
        <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          <FiPlus /> New Product
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
        />
        <button onClick={addCategory} className="rounded-md border border-border px-3 py-2 text-sm font-medium text-text hover:border-primary">
          Add category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-lg border border-border bg-surface p-4 theme-transition">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input placeholder="Product name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            <input placeholder="Brand" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:col-span-2" />
          </div>
          <textarea rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          <button type="submit" disabled={submitting || !form.name || !form.category} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
            {submitting ? "Creating..." : "Create product"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface theme-transition">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-text">{p.name}</td>
                  <td className="px-4 py-3 text-text-muted">{p.category?.name}</td>
                  <td className="px-4 py-3 text-text-muted">${p.price}</td>
                  <td className="px-4 py-3 text-text-muted">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.isActive ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(p)} className="rounded-md p-1.5 text-text-muted hover:bg-bg hover:text-danger">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

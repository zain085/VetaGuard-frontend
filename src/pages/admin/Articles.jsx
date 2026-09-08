import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEyeOff, FiEye } from "react-icons/fi";
import { careService } from "../../services/care.service";
import { adminArticleService } from "../../services/admin.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const CATEGORIES = ["Feeding", "Hygiene", "Exercise", "Vaccination", "Grooming", "Training", "General Health", "Emergency Care"];

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Feeding", excerpt: "", content: "", readTime: 3 });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    careService
      .list({ limit: 50 })
      .then(({ data }) => setArticles(data.articles))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load articles"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminArticleService.create({ ...form, readTime: Number(form.readTime) || 3 });
      toast.success("Article published");
      setForm({ title: "", category: "Feeding", excerpt: "", content: "", readTime: 3 });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to create article");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (article) => {
    try {
      if (article.published) {
        await adminArticleService.delete(article._id);
      } else {
        await adminArticleService.update(article._id, { published: true });
      }
      toast.success(article.published ? "Article unpublished" : "Article published");
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update article");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Care Articles</h1>
        <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          <FiPlus /> New Article
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-lg border border-border bg-surface p-4 theme-transition">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" min="1" placeholder="Read time (min)" value={form.readTime} onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))} className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <input placeholder="Excerpt (short summary)" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          <textarea rows={6} placeholder="Full article content" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          <button type="submit" disabled={submitting || !form.title || !form.content} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
            {submitting ? "Publishing..." : "Publish article"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : (
        <div className="mt-6 space-y-3">
          {articles.map((a) => (
            <div key={a._id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition">
              <div>
                <p className="font-medium text-text">{a.title}</p>
                <p className="text-xs text-text-muted">{a.category} · {a.readTime} min read</p>
              </div>
              <button onClick={() => togglePublished(a)} className="rounded-md border border-border p-2 text-text-muted hover:border-primary">
                {a.published ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

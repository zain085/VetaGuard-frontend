import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBookOpen, FiClock } from "react-icons/fi";
import { careService } from "../../services/care.service";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const CATEGORIES = ["", "Feeding", "Hygiene", "Exercise", "Vaccination", "Grooming", "Training", "General Health", "Emergency Care"];

export default function Care() {
  useDocumentTitle("Pet Care Resources");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    setLoading(true);
    careService
      .list(category ? { category } : {})
      .then(({ data }) => setArticles(data.articles))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Pet Care Resources</h1>
      <p className="mt-1 text-sm text-text-muted">Vet-informed articles on keeping your pet happy and healthy.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c || "all"}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              category === c ? "bg-primary text-white" : "border border-border text-text-muted hover:border-primary"
            }`}
          >
            {c || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : articles.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={FiBookOpen} title="No articles found" description="Check back soon for new content." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a._id}
              to={`/care/${a.slug}`}
              className="block overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-shadow hover:shadow-md theme-transition"
            >
              <div className="flex h-36 items-center justify-center bg-bg">
                {a.coverImage?.url ? (
                  <img src={a.coverImage.url} alt={a.title} className="h-full w-full object-cover" />
                ) : (
                  <FiBookOpen className="h-8 w-8 text-text-muted" />
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium text-primary">{a.category}</p>
                <h3 className="mt-1 font-semibold text-text">{a.title}</h3>
                {a.excerpt && <p className="mt-1 text-sm text-text-muted line-clamp-2">{a.excerpt}</p>}
                <p className="mt-3 flex items-center gap-1 text-xs text-text-muted"><FiClock size={12} /> {a.readTime} min read</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

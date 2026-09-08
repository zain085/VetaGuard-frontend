import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiClock, FiArrowLeft } from "react-icons/fi";
import { careService } from "../../services/care.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function CareArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useDocumentTitle(article ? article.title : "Care Article");

  useEffect(() => {
    careService
      .getBySlug(slug)
      .then(({ data }) => setArticle(data.article))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner className="h-8 w-8" /></div>;
  }
  if (!article) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/care" className="flex items-center gap-1 text-sm text-text-muted hover:text-primary">
        <FiArrowLeft size={14} /> Back to Care
      </Link>

      {article.coverImage?.url && (
        <img src={article.coverImage.url} alt={article.title} className="mt-4 h-56 w-full rounded-lg object-cover" />
      )}

      <p className="mt-6 text-xs font-medium text-primary">{article.category}</p>
      <h1 className="mt-1 text-2xl font-semibold text-text">{article.title}</h1>
      <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
        {article.author?.name && <span>By {article.author.name}</span>}
        <span className="flex items-center gap-1"><FiClock size={12} /> {article.readTime} min read</span>
      </div>

      <div className="prose prose-sm mt-6 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-text">
        {article.content}
      </div>

      {article.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((t) => (
            <span key={t} className="rounded-full bg-bg px-2.5 py-1 text-xs text-text-muted">#{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

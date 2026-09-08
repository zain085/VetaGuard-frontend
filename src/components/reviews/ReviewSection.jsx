import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// Generic review list + submission form. The parent supplies fetch/submit
// functions so this same component serves both product and vet reviews.
export default function ReviewSection({ fetchReviews, submitReview, canReview, restrictionNote }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    fetchReviews()
      .then(({ data }) => setReviews(data.reviews))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitReview({ rating, comment: comment.trim() || undefined });
      toast.success("Review submitted");
      setComment("");
      setRating(5);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-text">Reviews</h2>

      {loading ? null : reviews.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">No reviews yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-lg border border-border bg-surface p-4 theme-transition">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text">{r.user?.name || "Anonymous"}</p>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={12} className={i < r.rating ? "fill-warning text-warning" : "text-border"} />
                  ))}
                </div>
              </div>
              {r.comment && <p className="mt-2 text-sm text-text-muted">{r.comment}</p>}
              <p className="mt-2 text-xs text-text-muted">{format(new Date(r.createdAt), "MMM d, yyyy")}</p>
            </div>
          ))}
        </div>
      )}

      {user && canReview && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-lg border border-border bg-surface p-4 theme-transition">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text">Your rating:</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button type="button" key={i} onClick={() => setRating(i + 1)}>
                  <FiStar size={18} className={i < rating ? "fill-warning text-warning" : "text-border"} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            rows={2}
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
          />
          <button type="submit" disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
      {user && !canReview && restrictionNote && (
        <p className="mt-4 text-xs text-text-muted">{restrictionNote}</p>
      )}
    </div>
  );
}

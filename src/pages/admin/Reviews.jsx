import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiStar, FiTrash2, FiEyeOff, FiEye } from "react-icons/fi";
import { adminService } from "../../services/admin.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminReviews() {
  const [type, setType] = useState("product");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService
      .listReviews(type)
      .then(({ data }) => setReviews(data.reviews))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleApproval = async (review) => {
    try {
      await adminService.moderateReview(review._id, type, !review.isApproved);
      toast.success(review.isApproved ? "Review hidden" : "Review approved");
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update review");
    }
  };

  const remove = async (review) => {
    try {
      await adminService.deleteReview(review._id, type);
      toast.success("Review deleted");
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to delete review");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Reviews</h1>

      <div className="mt-4 flex gap-2">
        <button onClick={() => setType("product")} className={`rounded-full px-3 py-1.5 text-xs font-medium ${type === "product" ? "bg-primary text-white" : "border border-border text-text-muted hover:border-primary"}`}>
          Product reviews
        </button>
        <button onClick={() => setType("vet")} className={`rounded-full px-3 py-1.5 text-xs font-medium ${type === "vet" ? "bg-primary text-white" : "border border-border text-text-muted hover:border-primary"}`}>
          Vet reviews
        </button>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : reviews.length === 0 ? (
        <p className="mt-8 text-sm text-text-muted">No reviews yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-text">{r.user?.name}</p>
                  <p className="text-xs text-text-muted">
                    on {type === "vet" ? r.veterinarian?.name : r.product?.name}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar key={i} size={12} className={i < r.rating ? "fill-warning text-warning" : "text-border"} />
                  ))}
                </div>
              </div>
              {r.comment && <p className="mt-2 text-sm text-text-muted">{r.comment}</p>}
              <div className="mt-3 flex gap-2">
                <button onClick={() => toggleApproval(r)} className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text hover:border-primary">
                  {r.isApproved ? <FiEyeOff size={12} /> : <FiEye size={12} />} {r.isApproved ? "Hide" : "Approve"}
                </button>
                <button onClick={() => remove(r)} className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-danger hover:border-danger">
                  <FiTrash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

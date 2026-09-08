import { Link } from "react-router-dom";
import { FiUser, FiStar, FiMapPin, FiBriefcase } from "react-icons/fi";

export default function VetCard({ vet }) {
  return (
    <Link
      to={`/vets/${vet._id}`}
      className="block overflow-hidden rounded-lg border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md theme-transition"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg">
          {vet.profileImage?.url ? (
            <img src={vet.profileImage.url} alt={vet.user?.name} className="h-full w-full object-cover" />
          ) : (
            <FiUser className="h-6 w-6 text-text-muted" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-text">Dr. {vet.user?.name}</h3>
          <p className="truncate text-sm text-text-muted">{vet.specialization}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <FiStar className="text-warning" /> {vet.rating?.toFixed(1) || "New"} ({vet.reviewCount || 0})
        </span>
        <span className="flex items-center gap-1">
          <FiBriefcase /> {vet.experience || 0} yrs experience
        </span>
        {vet.city && (
          <span className="flex items-center gap-1">
            <FiMapPin /> {vet.city}
          </span>
        )}
      </div>
    </Link>
  );
}

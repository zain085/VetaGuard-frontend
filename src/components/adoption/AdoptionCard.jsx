import { Link } from "react-router-dom";
import { FiHeart, FiMapPin } from "react-icons/fi";

const statusStyles = {
  available: "bg-success/15 text-success",
  application_pending: "bg-warning/15 text-warning",
  reserved: "bg-info/15 text-info",
  adopted: "bg-text-muted/15 text-text-muted",
  unavailable: "bg-text-muted/15 text-text-muted",
};

const statusLabel = {
  available: "Available",
  application_pending: "Application Pending",
  reserved: "Reserved",
  adopted: "Adopted",
  unavailable: "Unavailable",
};

export default function AdoptionCard({ pet }) {
  return (
    <Link
      to={`/adoption/${pet._id}`}
      className="block overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-shadow hover:shadow-md theme-transition"
    >
      <div className="flex h-40 items-center justify-center bg-bg">
        {pet.images?.[0]?.url ? (
          <img src={pet.images[0].url} alt={pet.name} className="h-full w-full object-cover" />
        ) : (
          <FiHeart className="h-10 w-10 text-text-muted" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text">{pet.name}</h3>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[pet.adoptionStatus]}`}>
            {statusLabel[pet.adoptionStatus]}
          </span>
        </div>
        <p className="mt-1 text-sm text-text-muted">
          {pet.species}{pet.breed ? ` · ${pet.breed}` : ""}{pet.age != null ? ` · ${pet.age} yr` : ""}
        </p>
        {pet.shelter?.city && (
          <p className="mt-2 flex items-center gap-1 text-xs text-text-muted">
            <FiMapPin size={12} /> {pet.shelter.shelterName}, {pet.shelter.city}
          </p>
        )}
      </div>
    </Link>
  );
}

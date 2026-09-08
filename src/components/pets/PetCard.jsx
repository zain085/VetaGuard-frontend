import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

const statusColor = {
  active: "text-success",
  deceased: "text-text-muted",
  archived: "text-warning",
};

export default function PetCard({ pet }) {
  return (
    <Link
      to={`/dashboard/pets/${pet._id}`}
      className="block overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-shadow hover:shadow-md theme-transition"
    >
      <div className="flex h-36 items-center justify-center bg-bg">
        {pet.profileImage?.url ? (
          <img src={pet.profileImage.url} alt={pet.name} className="h-full w-full object-cover" />
        ) : (
          <FiHeart className="h-10 w-10 text-text-muted" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-text">{pet.name}</h3>
          <span className={`text-xs font-medium capitalize ${statusColor[pet.status] || "text-text-muted"}`}>
            {pet.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-text-muted">
          {pet.species}
          {pet.breed ? ` · ${pet.breed}` : ""}
          {pet.age != null ? ` · ${pet.age} yr` : ""}
        </p>
      </div>
    </Link>
  );
}

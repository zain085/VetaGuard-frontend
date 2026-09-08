import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiPlus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { petService } from "../../services/pet.service";
import PetCard from "../../components/pets/PetCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    petService
      .list({ limit: 3 })
      .then(({ data }) => setPets(data.pets))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm text-text-muted capitalize">Role: {user?.role}</p>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">Your Pets</h2>
        <Link to="/dashboard/pets" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : pets.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border bg-surface p-8 text-center theme-transition">
          <FiHeart className="mx-auto h-8 w-8 text-text-muted" />
          <p className="mt-3 text-sm text-text-muted">You haven't added any pets yet.</p>
          <Link
            to="/dashboard/pets/new"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            <FiPlus /> Add your first pet
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}

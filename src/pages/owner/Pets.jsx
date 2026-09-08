import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import { petService } from "../../services/pet.service";
import PetCard from "../../components/pets/PetCard";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    petService
      .list()
      .then(({ data }) => {
        if (active) setPets(data.pets);
      })
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load pets"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">My Pets</h1>
        <Link
          to="/dashboard/pets/new"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          <FiPlus /> Add Pet
        </Link>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      ) : pets.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FiHeart}
            title="You haven't added any pets yet"
            description="Add your first pet to start tracking their health."
            action={
              <Link
                to="/dashboard/pets/new"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Add your first pet
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}

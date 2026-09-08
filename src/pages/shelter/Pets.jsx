import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiHeart } from "react-icons/fi";
import { shelterPetService } from "../../services/shelter.service";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const STATUS_OPTIONS = ["available", "application_pending", "reserved", "adopted", "unavailable"];

export default function ShelterPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    shelterPetService
      .listMine()
      .then(({ data }) => setPets(data.pets))
      .catch((err) => {
        if (err.response?.status !== 404) toast.error(err.friendlyMessage || "Failed to load listings");
        setPets([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeStatus = async (pet, status) => {
    try {
      await shelterPetService.updateStatus(pet._id, status);
      toast.success("Status updated");
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update status");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Pet Listings</h1>
        <Link to="/shelter/pets/new" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          <FiPlus /> List a Pet
        </Link>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : pets.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FiHeart}
            title="No pets listed yet"
            description="Add your first adoptable pet to start receiving applications."
            action={<Link to="/shelter/pets/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">List a pet</Link>}
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {pets.map((pet) => (
            <div key={pet._id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-text">{pet.name}</p>
                <p className="text-sm text-text-muted">{pet.species}{pet.breed ? ` · ${pet.breed}` : ""}</p>
              </div>
              <select
                value={pet.adoptionStatus}
                onChange={(e) => changeStatus(pet, e.target.value)}
                className="rounded-md border border-border bg-bg px-3 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

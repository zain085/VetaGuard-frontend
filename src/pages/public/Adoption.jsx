import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { shelterPetService } from "../../services/shelter.service";
import AdoptionCard from "../../components/adoption/AdoptionCard";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const SPECIES = ["", "Dog", "Cat", "Bird", "Rabbit", "Other"];

export default function Adoption() {
  useDocumentTitle("Adopt a Pet");
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ species: "", breed: "", city: "" });

  const load = async (params) => {
    setLoading(true);
    try {
      const { data } = await shelterPetService.list(params);
      setPets(data.pets);
    } catch {
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({});
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (filters.species) params.species = filters.species;
    if (filters.breed) params.breed = filters.breed;
    if (filters.city) params.city = filters.city;
    load(params);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Adopt a Pet</h1>
      <p className="mt-1 text-sm text-text-muted">Browse animals from shelters looking for a home.</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <select
          value={filters.species}
          onChange={(e) => setFilters((f) => ({ ...f, species: e.target.value }))}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:w-40"
        >
          {SPECIES.map((s) => <option key={s} value={s}>{s || "All species"}</option>)}
        </select>
        <input
          placeholder="Breed"
          value={filters.breed}
          onChange={(e) => setFilters((f) => ({ ...f, breed: e.target.value }))}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:w-40"
        />
        <input
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:w-40"
        />
        <button type="submit" className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          Filter
        </button>
      </form>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : pets.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={FiHeart} title="No adoptable pets found" description="Try adjusting your filters, or check back soon." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => <AdoptionCard key={pet._id} pet={pet} />)}
        </div>
      )}
    </div>
  );
}

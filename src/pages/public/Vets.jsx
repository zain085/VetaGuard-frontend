import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { vetService } from "../../services/vet.service";
import VetCard from "../../components/vets/VetCard";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function Vets() {
  useDocumentTitle("Find a Veterinarian");
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", specialization: "", city: "" });

  const load = async (params) => {
    setLoading(true);
    try {
      const { data } = await vetService.list(params);
      setVets(data.vets);
    } catch {
      setVets([]);
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
    if (filters.search) params.search = filters.search;
    if (filters.specialization) params.specialization = filters.specialization;
    if (filters.city) params.city = filters.city;
    load(params);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Find a Veterinarian</h1>
      <p className="mt-1 text-sm text-text-muted">Search and filter by specialization, city, or name.</p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            placeholder="Search by name..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text focus:border-primary focus:outline-none"
          />
        </div>
        <input
          placeholder="Specialization"
          value={filters.specialization}
          onChange={(e) => setFilters((f) => ({ ...f, specialization: e.target.value }))}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:w-48"
        />
        <input
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:w-40"
        />
        <button type="submit" className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          Search
        </button>
      </form>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      ) : vets.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No veterinarians found" description="Try adjusting your search or filters." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vets.map((vet) => (
            <VetCard key={vet._id} vet={vet} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiHeart, FiMapPin, FiShield } from "react-icons/fi";
import { shelterPetService, adoptionService } from "../../services/shelter.service";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const HOUSING_TYPES = ["House", "Apartment", "Condo", "Farm", "Other"];

export default function AdoptionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    reason: "", experience: "", householdInfo: "",
    housingType: "House", hasOtherPets: false, otherPetDetails: "", contactPreference: "email",
  });

  useDocumentTitle(pet ? pet.name : "Adopt a Pet");

  useEffect(() => {
    shelterPetService
      .getById(id)
      .then(({ data }) => setPet(data.pet))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load pet"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.reason.trim()) {
      toast.error("Please share why you'd like to adopt");
      return;
    }
    setSubmitting(true);
    try {
      await adoptionService.apply({ shelterPet: id, ...form });
      toast.success("Application submitted — the shelter will review it soon");
      navigate("/dashboard/applications");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner className="h-8 w-8" /></div>;
  }
  if (!pet) return null;

  const canApply = pet.adoptionStatus === "available" || pet.adoptionStatus === "application_pending";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm theme-transition">
        <div className="flex h-64 items-center justify-center bg-bg">
          {pet.images?.[0]?.url ? (
            <img src={pet.images[0].url} alt={pet.name} className="h-full w-full object-cover" />
          ) : (
            <FiHeart className="h-14 w-14 text-text-muted" />
          )}
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-text">{pet.name}</h1>
          <p className="mt-1 text-sm text-text-muted">
            {pet.species}{pet.breed ? ` · ${pet.breed}` : ""}{pet.age != null ? ` · ${pet.age} yr` : ""}{pet.gender ? ` · ${pet.gender}` : ""}
          </p>
          {pet.shelter && (
            <p className="mt-2 flex items-center gap-1 text-sm text-text-muted">
              <FiMapPin size={14} /> {pet.shelter.shelterName}, {pet.shelter.city}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-success">
              <FiShield size={12} /> {pet.healthStatus}
            </span>
            <span className="rounded-full bg-info/15 px-2.5 py-1 text-info">{pet.vaccinationStatus}</span>
            {pet.temperament?.map((t) => (
              <span key={t} className="rounded-full bg-bg px-2.5 py-1 text-text-muted">{t}</span>
            ))}
          </div>
          {pet.description && <p className="mt-4 text-sm text-text-muted">{pet.description}</p>}
          {pet.specialNeeds && (
            <p className="mt-3 rounded-md bg-warning/10 p-3 text-sm text-warning">
              Special needs: {pet.specialNeeds}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        {!user && (
          <p className="rounded-md border border-border bg-surface p-4 text-sm text-text-muted theme-transition">
            Please <Link to="/login" className="font-medium text-primary hover:underline">log in</Link> as a pet owner to apply.
          </p>
        )}
        {user && user.role !== "owner" && (
          <p className="rounded-md border border-border bg-surface p-4 text-sm text-text-muted theme-transition">
            Only pet owner accounts can submit adoption applications.
          </p>
        )}
        {user && user.role === "owner" && !canApply && (
          <p className="rounded-md border border-border bg-surface p-4 text-sm text-text-muted theme-transition">
            This pet is no longer accepting applications.
          </p>
        )}
        {user && user.role === "owner" && canApply && !showForm && (
          <button onClick={() => setShowForm(true)} className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
            Apply to Adopt
          </button>
        )}

        {showForm && (
          <form onSubmit={handleApply} className="mt-4 space-y-4 rounded-lg border border-border bg-surface p-6 theme-transition">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Why would you like to adopt {pet.name}?</label>
              <textarea rows={3} value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Pet ownership experience</label>
              <textarea rows={2} value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Housing type</label>
                <select value={form.housingType} onChange={(e) => setForm((f) => ({ ...f, housingType: e.target.value }))} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
                  {HOUSING_TYPES.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Preferred contact</label>
                <select value={form.contactPreference} onChange={(e) => setForm((f) => ({ ...f, contactPreference: e.target.value }))} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-text">
                <input type="checkbox" checked={form.hasOtherPets} onChange={(e) => setForm((f) => ({ ...f, hasOtherPets: e.target.checked }))} />
                I have other pets at home
              </label>
              {form.hasOtherPets && (
                <input
                  placeholder="Tell us about your other pets"
                  value={form.otherPetDetails}
                  onChange={(e) => setForm((f) => ({ ...f, otherPetDetails: e.target.value }))}
                  className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
                />
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Household info</label>
              <input
                placeholder="e.g. Family of 4, fenced backyard"
                value={form.householdInfo}
                onChange={(e) => setForm((f) => ({ ...f, householdInfo: e.target.value }))}
                className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              />
            </div>
            <button type="submit" disabled={submitting} className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiHeart, FiPlus } from "react-icons/fi";
import { petService } from "../../services/pet.service";
import { vaccinationSchema } from "../../schemas/pet.schema";
import Timeline from "../../components/pets/Timeline";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function PetDetail() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVaxForm, setShowVaxForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(vaccinationSchema) });

  const loadData = async () => {
    try {
      const [petRes, timelineRes] = await Promise.all([
        petService.getById(id),
        petService.getTimeline(id),
      ]);
      setPet(petRes.data.pet);
      setEvents(timelineRes.data.events);
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to load pet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onAddVaccination = async (values) => {
    try {
      await petService.addVaccination(id, values);
      toast.success("Vaccination logged");
      reset();
      setShowVaxForm(false);
      loadData();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to log vaccination");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!pet) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface border border-border">
          {pet.profileImage?.url ? (
            <img src={pet.profileImage.url} alt={pet.name} className="h-full w-full object-cover" />
          ) : (
            <FiHeart className="h-8 w-8 text-text-muted" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-text">{pet.name}</h1>
          <p className="text-sm text-text-muted">
            {pet.species}{pet.breed ? ` · ${pet.breed}` : ""}{pet.age != null ? ` · ${pet.age} yr` : ""}
          </p>
          {(pet.allergies?.length > 0 || pet.chronicConditions?.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {pet.allergies?.map((a) => (
                <span key={a} className="rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-medium text-warning">
                  Allergy: {a}
                </span>
              ))}
              {pet.chronicConditions?.map((c) => (
                <span key={c} className="rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {pet.description && <p className="mt-4 text-sm text-text-muted">{pet.description}</p>}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">Health Timeline</h2>
        <button
          onClick={() => setShowVaxForm((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text hover:border-primary"
        >
          <FiPlus size={14} /> Log vaccination
        </button>
      </div>

      {showVaxForm && (
        <form
          onSubmit={handleSubmit(onAddVaccination)}
          className="mt-4 space-y-3 rounded-lg border border-border bg-surface p-4 theme-transition"
          noValidate
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-text">Vaccine name</label>
              <input {...register("vaccineName")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
              {errors.vaccineName && <p className="mt-1 text-xs text-danger">{errors.vaccineName.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text">Date administered</label>
              <input type="date" {...register("dateAdministered")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
              {errors.dateAdministered && <p className="mt-1 text-xs text-danger">{errors.dateAdministered.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text">Next due date</label>
              <input type="date" {...register("nextDueDate")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save vaccination"}
          </button>
        </form>
      )}

      <div className="mt-6">
        <Timeline events={events} />
      </div>
    </div>
  );
}

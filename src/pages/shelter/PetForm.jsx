import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { shelterPetService } from "../../services/shelter.service";

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
const GENDERS = ["Male", "Female", "Unknown"];

export default function ShelterPetForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { species: "Dog", gender: "Unknown", healthStatus: "Healthy", vaccinationStatus: "Up to date" },
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        temperament: values.temperament
          ? values.temperament.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };
      const { data } = await shelterPetService.create(payload);
      toast.success(`${data.pet.name} was listed successfully`);
      navigate("/shelter/pets");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to list pet");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">List a Pet for Adoption</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-6 theme-transition">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Name</label>
          <input {...register("name", { required: true })} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Species</label>
            <select {...register("species")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
              {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Gender</label>
            <select {...register("gender")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Breed</label>
            <input {...register("breed")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Approx. age (years)</label>
            <input type="number" min="0" step="0.5" {...register("age")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Temperament (comma-separated)</label>
          <input placeholder="Friendly, Playful, Good with kids" {...register("temperament")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Description</label>
          <textarea rows={4} {...register("description")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Special needs (optional)</label>
          <input {...register("specialNeeds")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
          {isSubmitting ? "Listing..." : "List Pet"}
        </button>
      </form>
    </div>
  );
}

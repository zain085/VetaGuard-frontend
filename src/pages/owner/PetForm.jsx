import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { petSchema } from "../../schemas/pet.schema";
import { petService } from "../../services/pet.service";

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Other"];
const GENDERS = ["Male", "Female", "Unknown"];

export default function PetForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(petSchema), defaultValues: { species: "Dog", gender: "Unknown" } });

  const onSubmit = async (values) => {
    try {
      const { data } = await petService.create(values);
      toast.success(`${data.pet.name} was added successfully`);
      navigate(`/dashboard/pets/${data.pet._id}`);
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to add pet");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Add a Pet</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-6 theme-transition" noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="name">Name</label>
          <input id="name" {...register("name")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="species">Species</label>
            <select id="species" {...register("species")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
              {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.species && <p className="mt-1 text-xs text-danger">{errors.species.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="gender">Gender</label>
            <select id="gender" {...register("gender")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none">
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="breed">Breed</label>
            <input id="breed" {...register("breed")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="dateOfBirth">Date of birth</label>
            <input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="weight">Weight (kg)</label>
            <input id="weight" type="number" step="0.1" {...register("weight")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
            {errors.weight && <p className="mt-1 text-xs text-danger">{errors.weight.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="color">Color</label>
            <input id="color" {...register("color")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="description">Description</label>
          <textarea id="description" rows={3} {...register("description")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {isSubmitting ? "Adding..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
}

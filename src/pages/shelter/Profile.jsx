import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { shelterService } from "../../services/shelter.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function ShelterProfile() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    shelterService
      .getMine()
      .then(({ data }) => {
        if (data.shelter) {
          reset({
            shelterName: data.shelter.shelterName || "",
            contactPerson: data.shelter.contactPerson || "",
            phone: data.shelter.phone || "",
            address: data.shelter.address || "",
            city: data.shelter.city || "",
            description: data.shelter.description || "",
            website: data.shelter.website || "",
          });
        }
      })
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      await shelterService.upsertMine(values);
      toast.success("Shelter profile saved");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to save profile");
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner className="h-8 w-8" /></div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Shelter Profile</h1>
      <p className="mt-1 text-sm text-text-muted">This is what adopters see when browsing your listings.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-6 theme-transition">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Shelter name</label>
          <input {...register("shelterName", { required: true })} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Contact person</label>
            <input {...register("contactPerson")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Phone</label>
            <input {...register("phone")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Address</label>
            <input {...register("address")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">City</label>
            <input {...register("city")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Website</label>
          <input {...register("website")} placeholder="https://" className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">About your shelter</label>
          <textarea rows={4} {...register("description")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
          {isSubmitting ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}

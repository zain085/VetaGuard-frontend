import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { vetService } from "../../services/vet.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function VetProfile() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    vetService
      .getMyProfile()
      .then(({ data }) => {
        if (data.vet) {
          reset({
            specialization: data.vet.specialization || "",
            qualification: data.vet.qualification || "",
            experience: data.vet.experience || 0,
            clinicName: data.vet.clinicName || "",
            clinicAddress: data.vet.clinicAddress || "",
            city: data.vet.city || "",
            bio: data.vet.bio || "",
            consultationFee: data.vet.consultationFee || "",
          });
        }
      })
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values) => {
    try {
      await vetService.upsertMyProfile(values);
      toast.success("Profile saved — you're now visible in vet search");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to save profile");
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner className="h-8 w-8" /></div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Professional Profile</h1>
      <p className="mt-1 text-sm text-text-muted">This is what pet owners see when they search for a vet.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-6 theme-transition">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Specialization</label>
            <input {...register("specialization", { required: true })} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Qualification</label>
            <input {...register("qualification")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Years of experience</label>
            <input type="number" min="0" {...register("experience")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Consultation fee</label>
            <input type="number" min="0" {...register("consultationFee")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Clinic name</label>
          <input {...register("clinicName")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Clinic address</label>
            <input {...register("clinicAddress")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">City</label>
            <input {...register("city")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Bio</label>
          <textarea rows={4} {...register("bio")} className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none" />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}

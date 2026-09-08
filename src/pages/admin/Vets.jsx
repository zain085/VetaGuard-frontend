import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/admin.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminVets() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService
      .listVets()
      .then(({ data }) => setVets(data.vets))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load veterinarians"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const act = async (vet, action) => {
    try {
      if (action === "approve") await adminService.approveVet(vet._id);
      else await adminService.suspendVet(vet._id);
      toast.success(`Veterinarian ${action === "approve" ? "approved" : "suspended"}`);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update veterinarian");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Veterinarians</h1>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : (
        <div className="mt-6 space-y-3">
          {vets.map((vet) => (
            <div key={vet._id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-text">Dr. {vet.user?.name}</p>
                <p className="text-sm text-text-muted">{vet.specialization} · {vet.city}</p>
                <div className="mt-1 flex gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${vet.isApproved ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                    {vet.isApproved ? "Approved" : "Pending"}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${vet.isActive ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                    {vet.isActive ? "Active" : "Suspended"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {!vet.isApproved && (
                  <button onClick={() => act(vet, "approve")} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover">
                    Approve
                  </button>
                )}
                {vet.isActive ? (
                  <button onClick={() => act(vet, "suspend")} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-danger hover:border-danger">
                    Suspend
                  </button>
                ) : (
                  <button onClick={() => act(vet, "approve")} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text hover:border-primary">
                    Reinstate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

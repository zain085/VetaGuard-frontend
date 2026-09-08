import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/admin.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function AdminShelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService
      .listShelters()
      .then(({ data }) => setShelters(data.shelters))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load shelters"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const act = async (shelter, action) => {
    try {
      if (action === "approve") await adminService.approveShelter(shelter._id);
      else await adminService.suspendShelter(shelter._id);
      toast.success(`Shelter ${action === "approve" ? "approved" : "suspended"}`);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update shelter");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Shelters</h1>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : (
        <div className="mt-6 space-y-3">
          {shelters.map((shelter) => (
            <div key={shelter._id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-text">{shelter.shelterName}</p>
                <p className="text-sm text-text-muted">{shelter.city} · {shelter.user?.email}</p>
                <div className="mt-1 flex gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${shelter.verified ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                    {shelter.verified ? "Verified" : "Unverified"}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${shelter.isActive ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                    {shelter.isActive ? "Active" : "Suspended"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {!shelter.verified && (
                  <button onClick={() => act(shelter, "approve")} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover">
                    Verify
                  </button>
                )}
                {shelter.isActive ? (
                  <button onClick={() => act(shelter, "suspend")} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-danger hover:border-danger">
                    Suspend
                  </button>
                ) : (
                  <button onClick={() => act(shelter, "approve")} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text hover:border-primary">
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

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiFileText } from "react-icons/fi";
import { format } from "date-fns";
import { adoptionService } from "../../services/shelter.service";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const statusStyles = {
  pending: "bg-warning/15 text-warning",
  under_review: "bg-info/15 text-info",
  approved: "bg-success/15 text-success",
  rejected: "bg-danger/15 text-danger",
  withdrawn: "bg-text-muted/15 text-text-muted",
  completed: "bg-success/15 text-success",
};

export default function OwnerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawTarget, setWithdrawTarget] = useState(null);

  const load = () => {
    setLoading(true);
    adoptionService
      .mine()
      .then(({ data }) => setApplications(data.applications))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load applications"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleWithdraw = async () => {
    try {
      await adoptionService.withdraw(withdrawTarget._id);
      toast.success("Application withdrawn");
      setWithdrawTarget(null);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to withdraw application");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">My Adoption Applications</h1>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : applications.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={FiFileText} title="No applications yet" description="Browse adoptable pets and apply when you find a match." />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">{app.shelterPet?.name}</p>
                  <p className="text-sm text-text-muted">{app.shelter?.shelterName}, {app.shelter?.city}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[app.status]}`}>
                  {app.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-xs text-text-muted">Applied {format(new Date(app.createdAt), "MMM d, yyyy")}</p>
              {app.shelterNotes && (
                <p className="mt-2 rounded-md bg-bg p-2 text-xs text-text-muted">Shelter notes: {app.shelterNotes}</p>
              )}
              {["pending", "under_review"].includes(app.status) && (
                <button
                  onClick={() => setWithdrawTarget(app)}
                  className="mt-3 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-danger hover:border-danger"
                >
                  Withdraw
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!withdrawTarget}
        title="Withdraw this application?"
        description="You can apply again later if the pet is still available."
        confirmLabel="Withdraw"
        danger
        onConfirm={handleWithdraw}
        onCancel={() => setWithdrawTarget(null)}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiFileText } from "react-icons/fi";
import { format } from "date-fns";
import { adoptionService } from "../../services/shelter.service";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const FILTERS = ["all", "pending", "under_review", "approved", "rejected", "completed"];

export default function ShelterApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [notesDraft, setNotesDraft] = useState({});

  const load = () => {
    setLoading(true);
    adoptionService
      .forShelter(filter === "all" ? {} : { status: filter })
      .then(({ data }) => setApplications(data.applications))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load applications"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const act = async (app, status) => {
    try {
      await adoptionService.updateStatus(app._id, { status, shelterNotes: notesDraft[app._id] });
      toast.success(`Application ${status.replace("_", " ")}`);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update application");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Adoption Applications</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              filter === f ? "bg-primary text-white" : "border border-border text-text-muted hover:border-primary"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : applications.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={FiFileText} title="No applications" description="Nothing matches this filter yet." />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">{app.shelterPet?.name}</p>
                  <p className="text-sm text-text-muted">{app.applicant?.name} · {app.applicant?.email}</p>
                </div>
                <span className="shrink-0 rounded-full bg-bg px-2.5 py-0.5 text-xs font-medium capitalize text-text-muted">
                  {app.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-xs text-text-muted">Applied {format(new Date(app.createdAt), "MMM d, yyyy")}</p>
              <p className="mt-2 text-sm text-text-muted">{app.reason}</p>
              {app.experience && <p className="mt-1 text-xs text-text-muted">Experience: {app.experience}</p>}
              {app.housingType && <p className="mt-1 text-xs text-text-muted">Housing: {app.housingType}</p>}

              {["pending", "under_review"].includes(app.status) && (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    placeholder="Notes for applicant (optional)"
                    value={notesDraft[app._id] || ""}
                    onChange={(e) => setNotesDraft((d) => ({ ...d, [app._id]: e.target.value }))}
                    className="flex-1 rounded-md border border-border bg-bg px-2 py-1.5 text-xs text-text focus:border-primary focus:outline-none"
                  />
                  <div className="flex gap-2">
                    {app.status === "pending" && (
                      <button onClick={() => act(app, "under_review")} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text hover:border-primary">
                        Mark reviewing
                      </button>
                    )}
                    <button onClick={() => act(app, "approved")} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover">
                      Approve
                    </button>
                    <button onClick={() => act(app, "rejected")} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-danger hover:border-danger">
                      Reject
                    </button>
                  </div>
                </div>
              )}
              {app.status === "approved" && (
                <button onClick={() => act(app, "completed")} className="mt-3 rounded-md bg-success px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
                  Mark adoption completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

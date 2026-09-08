import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import { appointmentService } from "../../services/vet.service";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function VetAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [notesDraft, setNotesDraft] = useState({});

  const load = () => {
    setLoading(true);
    appointmentService
      .list(filter === "all" ? {} : { status: filter })
      .then(({ data }) => setAppointments(data.appointments))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const act = async (appointment, status, extra = {}) => {
    try {
      await appointmentService.updateStatus(appointment._id, { status, ...extra });
      toast.success(`Appointment ${status}`);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update appointment");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Appointments</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              filter === f ? "bg-primary text-white" : "border border-border text-text-muted hover:border-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : appointments.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={FiCalendar} title="No appointments" description="Nothing matches this filter yet." />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {appointments.map((a) => (
            <AppointmentCard key={a._id} appointment={a}>
              {a.status === "pending" && (
                <>
                  <button onClick={() => act(a, "confirmed")} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover">
                    Confirm
                  </button>
                  <button onClick={() => act(a, "rejected", { cancellationReason: "Not available at this time" })} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-danger hover:border-danger">
                    Reject
                  </button>
                </>
              )}
              {["confirmed", "rescheduled"].includes(a.status) && (
                <>
                  <input
                    placeholder="Treatment notes..."
                    value={notesDraft[a._id] || ""}
                    onChange={(e) => setNotesDraft((d) => ({ ...d, [a._id]: e.target.value }))}
                    className="flex-1 rounded-md border border-border bg-bg px-2 py-1.5 text-xs text-text focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={() => act(a, "completed", { treatmentSummary: notesDraft[a._id] || "" })}
                    className="shrink-0 rounded-md bg-success px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Mark completed
                  </button>
                </>
              )}
            </AppointmentCard>
          ))}
        </div>
      )}
    </div>
  );
}

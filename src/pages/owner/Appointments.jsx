import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import { appointmentService } from "../../services/vet.service";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function OwnerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);

  const load = () => {
    setLoading(true);
    appointmentService
      .list()
      .then(({ data }) => setAppointments(data.appointments))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async () => {
    try {
      await appointmentService.cancel(cancelTarget._id);
      toast.success("Appointment cancelled");
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to cancel appointment");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">My Appointments</h1>

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : appointments.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={FiCalendar} title="No appointments yet" description="Book a visit with a veterinarian to get started." />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {appointments.map((a) => (
            <AppointmentCard key={a._id} appointment={a}>
              {["pending", "confirmed", "rescheduled"].includes(a.status) && (
                <button
                  onClick={() => setCancelTarget(a)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-danger hover:border-danger"
                >
                  Cancel
                </button>
              )}
            </AppointmentCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel this appointment?"
        description="This can't be undone. The veterinarian will be notified."
        confirmLabel="Cancel appointment"
        danger
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}

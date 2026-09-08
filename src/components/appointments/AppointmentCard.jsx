import { format } from "date-fns";
import { FiClock, FiCalendar } from "react-icons/fi";

const statusStyles = {
  pending: "bg-warning/15 text-warning",
  confirmed: "bg-info/15 text-info",
  rescheduled: "bg-info/15 text-info",
  completed: "bg-success/15 text-success",
  cancelled: "bg-text-muted/15 text-text-muted",
  rejected: "bg-danger/15 text-danger",
};

export default function AppointmentCard({ appointment, children }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-text">{appointment.pet?.name}</p>
          <p className="text-sm text-text-muted">{appointment.reason}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[appointment.status]}`}>
          {appointment.status}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
        <span className="flex items-center gap-1"><FiCalendar /> {format(new Date(appointment.date), "MMM d, yyyy")}</span>
        <span className="flex items-center gap-1"><FiClock /> {appointment.time}</span>
        {appointment.veterinarian?.name && <span>Dr. {appointment.veterinarian.name}</span>}
        {appointment.owner?.name && <span>{appointment.owner.name}</span>}
      </div>
      {appointment.treatmentSummary && (
        <p className="mt-2 rounded-md bg-bg p-2 text-xs text-text-muted">{appointment.treatmentSummary}</p>
      )}
      {appointment.cancellationReason && (
        <p className="mt-2 text-xs text-danger">Reason: {appointment.cancellationReason}</p>
      )}
      {children && <div className="mt-3 flex gap-2">{children}</div>}
    </div>
  );
}

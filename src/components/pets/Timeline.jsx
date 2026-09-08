import { FiActivity, FiShield } from "react-icons/fi";
import { format } from "date-fns";

const iconByType = {
  vaccination: FiShield,
  medicalRecord: FiActivity,
};

export default function Timeline({ events }) {
  if (!events.length) {
    return <p className="py-8 text-center text-sm text-text-muted">No health events recorded yet.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {events.map((event) => {
        const Icon = iconByType[event.type] || FiActivity;
        return (
          <li key={`${event.type}-${event.refId}`} className="relative">
            <span className="absolute -left-[1.95rem] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
              <Icon size={12} />
            </span>
            <div className="rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-text">{event.title}</h4>
                <time className="shrink-0 text-xs text-text-muted">
                  {event.date ? format(new Date(event.date), "MMM d, yyyy") : ""}
                </time>
              </div>
              {event.veterinarian && (
                <p className="mt-1 text-xs text-text-muted">Dr. {event.veterinarian}</p>
              )}
              {event.detail && <p className="mt-2 text-sm text-text-muted">{event.detail}</p>}
              {event.nextDueDate && (
                <p className="mt-2 text-xs font-medium text-warning">
                  Next due: {format(new Date(event.nextDueDate), "MMM d, yyyy")}
                </p>
              )}
              {event.followUpDate && (
                <p className="mt-2 text-xs font-medium text-warning">
                  Follow-up: {format(new Date(event.followUpDate), "MMM d, yyyy")}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

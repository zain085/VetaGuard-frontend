import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, isToday } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/vet.service";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function VetDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService
      .list({ limit: 50 })
      .then(({ data }) => setAppointments(data.appointments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const todays = appointments.filter((a) => isToday(new Date(a.date)));
  const pending = appointments.filter((a) => a.status === "pending");
  const upcoming = appointments.filter((a) => ["confirmed", "rescheduled"].includes(a.status));
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  const stats = [
    { label: "Today's Appointments", value: todays.length },
    { label: "Pending Requests", value: pending.length },
    { label: "Upcoming", value: upcoming.length },
    { label: "Completed", value: completedCount },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Welcome, Dr. {user?.name}</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4 theme-transition">
            <p className="text-2xl font-bold text-text">{s.value}</p>
            <p className="mt-1 text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">Pending Requests</h2>
        <Link to="/vet/appointments" className="text-sm font-medium text-primary hover:underline">View all</Link>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center"><LoadingSpinner /></div>
      ) : pending.length === 0 ? (
        <p className="mt-4 text-sm text-text-muted">No pending requests right now.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {pending.slice(0, 3).map((a) => (
            <AppointmentCard key={a._id} appointment={a} />
          ))}
        </div>
      )}
    </div>
  );
}

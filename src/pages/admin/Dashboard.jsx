import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { adminService } from "../../services/admin.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const PIE_COLORS = ["#0f766e", "#38bdaf", "#2dd4bf", "#5eead4"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboard()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner className="h-8 w-8" /></div>;
  }
  if (!stats) return null;

  const statCards = [
    { label: "Total Users", value: stats.totals.users },
    { label: "Pet Owners", value: stats.totals.owners },
    { label: "Veterinarians", value: stats.totals.vets },
    { label: "Shelters", value: stats.totals.shelters },
    { label: "Total Pets", value: stats.totals.pets },
    { label: "Shelter Animals", value: stats.totals.shelterAnimals },
    { label: "Appointments", value: stats.totals.appointments },
    { label: "Adoption Applications", value: stats.totals.adoptionApplications },
    { label: "Products", value: stats.totals.products },
    { label: "Reviews", value: stats.totals.reviews },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Admin Overview</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4 theme-transition">
            <p className="text-xl font-bold text-text">{s.value}</p>
            <p className="mt-1 text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4 theme-transition">
          <h2 className="text-sm font-semibold text-text">User Role Distribution</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.charts.roleBreakdown}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.role}: ${entry.count}`}
                >
                  {stats.charts.roleBreakdown.map((entry, index) => (
                    <Cell key={entry.role} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 theme-transition">
          <h2 className="text-sm font-semibold text-text">Appointment Activity</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.appointmentStatusBreakdown}>
                <XAxis dataKey="status" stroke="var(--color-text-muted)" fontSize={11} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 theme-transition lg:col-span-2">
          <h2 className="text-sm font-semibold text-text">User Growth (by month)</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.userGrowth}>
                <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={11} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#38bdaf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

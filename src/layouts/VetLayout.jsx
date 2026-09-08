import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiCalendar, FiClock, FiUser, FiLogOut } from "react-icons/fi";
import Logo from "../components/common/Logo";
import ThemeToggle from "../components/common/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/vet/dashboard", label: "Overview", icon: FiGrid, end: true },
  { to: "/vet/appointments", label: "Appointments", icon: FiCalendar },
  { to: "/vet/availability", label: "Availability", icon: FiClock },
  { to: "/vet/profile", label: "Profile", icon: FiUser },
];

export default function VetLayout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors theme-transition ${
      isActive ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-bg hover:text-text"
    }`;

  return (
    <div className="flex min-h-screen bg-bg text-text theme-transition">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface p-4 sm:flex sm:flex-col theme-transition">
        <Logo className="h-8 w-8" withWordmark wordmarkClassName="text-base" />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border pt-4">
          <p className="truncate text-sm font-medium text-text">Dr. {user?.name}</p>
          <p className="truncate text-xs text-text-muted capitalize">{user?.role}</p>
          <div className="mt-3 flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={logout}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium text-text-muted hover:border-danger hover:text-danger"
            >
              <FiLogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 sm:hidden theme-transition">
          <Logo className="h-7 w-7" withWordmark />
          <ThemeToggle />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

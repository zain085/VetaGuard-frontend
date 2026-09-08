import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import NotificationBell from "../notifications/NotificationBell";

const navLinks = [
  { to: "/vets", label: "Veterinarians" },
  { to: "/adoption", label: "Adoption" },
  { to: "/shop", label: "Shop" },
  { to: "/care", label: "Care" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const dashboardPath = user?.role === "vet" ? "/vet/dashboard" : user?.role === "shelter" ? "/shelter/dashboard" : user?.role === "admin" ? "/admin" : "/dashboard";

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors theme-transition ${
      isActive ? "text-primary" : "text-text-muted hover:text-text"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur theme-transition">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <Logo className="h-8 w-8" withWordmark wordmarkClassName="text-lg" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/cart" aria-label="Cart" className="relative flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:text-primary">
            <FiShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <NotificationBell />
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:text-text"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-text-muted hover:text-text"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link to="/cart" aria-label="Cart" className="relative flex h-9 w-9 items-center justify-center rounded-md text-text-muted">
            <FiShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-surface px-4 pb-4 md:hidden theme-transition">
          <div className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
            <hr className="border-border" />
            {user ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="text-sm font-medium text-text-muted">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-text-muted">
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import { Link } from "react-router-dom";
import { FiHeart, FiShield, FiUsers } from "react-icons/fi";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const values = [
  {
    icon: FiHeart,
    title: "Pet-first",
    desc: "Every feature starts from what genuinely helps a pet stay healthy and a household stay organized — not what looks impressive in a demo.",
  },
  {
    icon: FiShield,
    title: "Careful with health data",
    desc: "Medical records and appointment history are sensitive. Access is scoped by role and ownership at every layer, not just hidden in the UI.",
  },
  {
    icon: FiUsers,
    title: "Built for the whole circle of care",
    desc: "Owners, veterinarians, and shelters each get tools shaped for how they actually work, on one shared platform.",
  },
];

export default function About() {
  useDocumentTitle("About");
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">About VetaGuard</h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        VetaGuard is a centralized pet-care platform that brings health records, veterinary
        appointments, shelter adoption, and everyday pet care into one place. Instead of juggling
        a paper vaccination card, a separate booking app, and a shelter's Facebook page, pet
        owners, veterinarians, and shelters share one connected system.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-lg border border-border bg-surface p-5 theme-transition">
            <Icon className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
            <h2 className="mt-3 text-sm font-semibold text-text">{title}</h2>
            <p className="mt-1 text-sm text-text-muted">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-text">What's out of scope, on purpose</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          VetaGuard's shop lets you browse and build a cart, but does not process real payments
          or handle delivery — that's an intentional platform boundary, not a missing feature.
          Similarly, veterinarian and shelter accounts go through a lightweight approval step
          rather than external credential verification, in line with the platform's current scope.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-border bg-surface p-6 text-center theme-transition">
        <p className="text-sm text-text-muted">Ready to get started?</p>
        <Link to="/register" className="mt-3 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
          Create your account
        </Link>
      </div>
    </div>
  );
}

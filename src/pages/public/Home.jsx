import { Link } from "react-router-dom";
import { FiHeart, FiCalendar, FiShoppingBag, FiBookOpen, FiUsers, FiBell } from "react-icons/fi";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const features = [
  { icon: FiHeart, title: "Pet Health Management", desc: "Track vaccinations, medical history, and allergies in one place." },
  { icon: FiCalendar, title: "Veterinary Appointments", desc: "Discover vets nearby and book appointments in a few clicks." },
  { icon: FiUsers, title: "Adoption", desc: "Browse shelter animals and apply for adoption online." },
  { icon: FiShoppingBag, title: "Pet Products", desc: "Shop food, grooming, and accessories curated for your pet." },
  { icon: FiBell, title: "Smart Reminders", desc: "Never miss feeding, grooming, or vaccination schedules." },
  { icon: FiBookOpen, title: "Care Resources", desc: "Read vet-informed articles on pet health and wellbeing." },
];

const steps = [
  { step: "1", title: "Create your profile", desc: "Sign up as a pet owner, veterinarian, or shelter." },
  { step: "2", title: "Add your pets", desc: "Build health records for every pet in your care." },
  { step: "3", title: "Book & manage", desc: "Schedule appointments, track reminders, and shop essentials." },
  { step: "4", title: "Stay connected", desc: "Get notified about everything that matters for your pet." },
];

export default function Home() {
  useDocumentTitle("Home");
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-surface theme-transition">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Smarter Care. Healthier Pets. <span style={{ color: "var(--color-primary)" }}>Stronger Bonds.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-text-muted">
            VetaGuard brings pet health records, veterinary appointments, adoption, and everyday
            pet care together in one platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">
              Explore VetaGuard
            </Link>
            <Link to="/vets" className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-text hover:border-primary">
              Find a Veterinarian
            </Link>
            <Link to="/adoption" className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-text hover:border-primary">
              Explore Adoption
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold text-text">Everything your pet needs</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-border bg-surface p-6 shadow-sm theme-transition">
              <Icon className="h-6 w-6" style={{ color: "var(--color-primary)" }} />
              <h3 className="mt-3 font-semibold text-text">{title}</h3>
              <p className="mt-1 text-sm text-text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface theme-transition">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold text-text">How it works</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {s.step}
                </div>
                <h3 className="mt-3 font-semibold text-text">{s.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-text">Ready to give your pet better care?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
          Join pet owners, veterinarians, and shelters already using VetaGuard.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Create your free account
        </Link>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { shelterPetService, adoptionService } from "../../services/shelter.service";

export default function ShelterDashboard() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([shelterPetService.listMine(), adoptionService.forShelter()])
      .then(([petsRes, appsRes]) => {
        setPets(petsRes.data.pets);
        setApplications(appsRes.data.applications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const available = pets.filter((p) => p.adoptionStatus === "available").length;
  const adopted = pets.filter((p) => p.adoptionStatus === "adopted").length;
  const pendingApps = applications.filter((a) => a.status === "pending").length;

  const stats = [
    { label: "Total Listings", value: pets.length },
    { label: "Available", value: available },
    { label: "Adopted", value: adopted },
    { label: "Pending Applications", value: pendingApps },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-text">Welcome, {user?.name}</h1>
      {!loading && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-surface p-4 theme-transition">
              <p className="text-2xl font-bold text-text">{s.value}</p>
              <p className="mt-1 text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

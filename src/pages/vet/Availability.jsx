import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { vetService } from "../../services/vet.service";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function VetAvailability() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    vetService
      .getMyProfile()
      .then(({ data }) => setSlots(data.vet?.availability || []))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load availability"))
      .finally(() => setLoading(false));
  }, []);

  const addSlot = () => {
    setSlots((s) => [...s, { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", slotDurationMinutes: 30 }]);
  };

  const updateSlot = (index, field, value) => {
    setSlots((s) => s.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
  };

  const removeSlot = (index) => {
    setSlots((s) => s.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaving(true);
    try {
      await vetService.upsertMyProfile({ availability: slots });
      toast.success("Availability saved");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><LoadingSpinner className="h-8 w-8" /></div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Availability</h1>
        <button onClick={addSlot} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text hover:border-primary">
          <FiPlus size={14} /> Add slot
        </button>
      </div>
      <p className="mt-1 text-sm text-text-muted">
        Define your weekly recurring availability. Owners will only see time slots that fall within these windows and aren't already booked.
      </p>

      <div className="mt-6 space-y-3">
        {slots.length === 0 && (
          <p className="rounded-lg border border-dashed border-border bg-surface p-6 text-center text-sm text-text-muted theme-transition">
            No availability set yet — add a slot to start accepting bookings.
          </p>
        )}
        {slots.map((slot, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4 theme-transition">
            <select
              value={slot.dayOfWeek}
              onChange={(e) => updateSlot(i, "dayOfWeek", Number(e.target.value))}
              className="rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
            >
              {DAYS.map((d, idx) => <option key={d} value={idx}>{d}</option>)}
            </select>
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => updateSlot(i, "startTime", e.target.value)}
              className="rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
            />
            <span className="text-sm text-text-muted">to</span>
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => updateSlot(i, "endTime", e.target.value)}
              className="rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
            />
            <select
              value={slot.slotDurationMinutes}
              onChange={(e) => updateSlot(i, "slotDurationMinutes", Number(e.target.value))}
              className="rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-text focus:border-primary focus:outline-none"
            >
              {[15, 20, 30, 45, 60].map((m) => <option key={m} value={m}>{m} min slots</option>)}
            </select>
            <button onClick={() => removeSlot(i)} className="ml-auto rounded-md p-2 text-text-muted hover:bg-bg hover:text-danger">
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save availability"}
      </button>
    </div>
  );
}

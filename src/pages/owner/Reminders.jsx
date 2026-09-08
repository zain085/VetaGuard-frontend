import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBell, FiPlus, FiCheck, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { reminderService } from "../../services/care.service";
import { petService } from "../../services/pet.service";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const TYPES = ["feeding", "grooming", "vaccination", "medication", "appointment", "custom"];

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "custom", dueDate: "", pet: "", repeat: "none" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    reminderService
      .list()
      .then(({ data }) => setReminders(data.reminders))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load reminders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    petService.list({ limit: 50 }).then(({ data }) => setPets(data.pets)).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) {
      toast.error("Please enter a title and due date");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.pet) delete payload.pet;
      await reminderService.create(payload);
      toast.success("Reminder created");
      setForm({ title: "", type: "custom", dueDate: "", pet: "", repeat: "none" });
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to create reminder");
    } finally {
      setSubmitting(false);
    }
  };

  const complete = async (reminder) => {
    try {
      await reminderService.update(reminder._id, { status: "completed" });
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to update reminder");
    }
  };

  const remove = async (reminder) => {
    try {
      await reminderService.remove(reminder._id);
      load();
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to delete reminder");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Reminders</h1>
        <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
          <FiPlus /> New Reminder
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-lg border border-border bg-surface p-4 theme-transition">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              placeholder="Title (e.g. Feed Bruno)"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            />
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            />
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={form.pet}
              onChange={(e) => setForm((f) => ({ ...f, pet: e.target.value }))}
              className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              <option value="">No specific pet</option>
              {pets.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select
              value={form.repeat}
              onChange={(e) => setForm((f) => ({ ...f, repeat: e.target.value }))}
              className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none sm:col-span-2"
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60">
            {submitting ? "Saving..." : "Save reminder"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="mt-16 flex justify-center"><LoadingSpinner className="h-8 w-8" /></div>
      ) : reminders.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={FiBell} title="No reminders yet" description="Create a reminder for feeding, grooming, or medication." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {reminders.map((r) => (
            <div key={r._id} className={`flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm theme-transition ${r.status === "completed" ? "opacity-60" : ""}`}>
              <div>
                <p className={`font-medium text-text ${r.status === "completed" ? "line-through" : ""}`}>{r.title}</p>
                <p className="text-xs text-text-muted">
                  {format(new Date(r.dueDate), "MMM d, yyyy · h:mm a")}{r.pet?.name ? ` · ${r.pet.name}` : ""}{r.repeat !== "none" ? ` · repeats ${r.repeat}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {r.status !== "completed" && (
                  <button onClick={() => complete(r)} className="rounded-md border border-border p-2 text-success hover:border-success">
                    <FiCheck size={14} />
                  </button>
                )}
                <button onClick={() => remove(r)} className="rounded-md border border-border p-2 text-danger hover:border-danger">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

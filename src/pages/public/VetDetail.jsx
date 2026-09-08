import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiStar, FiMapPin, FiBriefcase, FiDollarSign } from "react-icons/fi";
import { format, addDays } from "date-fns";
import { vetService, appointmentService } from "../../services/vet.service";
import { petService } from "../../services/pet.service";
import { reviewService } from "../../services/care.service";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import ReviewSection from "../../components/reviews/ReviewSection";

const UPCOMING_DAYS = 10;

export default function VetDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);

  useDocumentTitle(vet ? `Dr. ${vet.user?.name}` : "Veterinarian");
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    vetService
      .getById(id)
      .then(({ data }) => setVet(data.vet))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load veterinarian"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    setSelectedSlot("");
    vetService
      .getSlots(id, selectedDate)
      .then(({ data }) => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [id, selectedDate]);

  useEffect(() => {
    if (user?.role === "owner") {
      petService.list({ limit: 50 }).then(({ data }) => {
        setPets(data.pets);
        if (data.pets.length) setSelectedPet(data.pets[0]._id);
      });
    }
  }, [user]);

  const dateOptions = Array.from({ length: UPCOMING_DAYS }, (_, i) => addDays(new Date(), i));

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedPet || !selectedSlot || !reason.trim()) {
      toast.error("Please select a pet, a time slot, and enter a reason");
      return;
    }
    setSubmitting(true);
    try {
      await appointmentService.create({
        veterinarian: vet.user._id,
        pet: selectedPet,
        date: selectedDate,
        time: selectedSlot,
        reason: reason.trim(),
      });
      toast.success("Appointment requested — you'll be notified once the vet confirms");
      navigate("/dashboard/appointments");
    } catch (err) {
      toast.error(err.friendlyMessage || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!vet) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 shadow-sm sm:flex-row theme-transition">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-bg">
          {vet.profileImage?.url ? (
            <img src={vet.profileImage.url} alt={vet.user?.name} className="h-full w-full object-cover" />
          ) : (
            <FiUser className="h-8 w-8 text-text-muted" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-text">Dr. {vet.user?.name}</h1>
          <p className="text-sm text-text-muted">{vet.specialization}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-text-muted">
            <span className="flex items-center gap-1"><FiStar className="text-warning" /> {vet.rating?.toFixed(1) || "New"} ({vet.reviewCount || 0} reviews)</span>
            <span className="flex items-center gap-1"><FiBriefcase /> {vet.experience || 0} yrs experience</span>
            {vet.city && <span className="flex items-center gap-1"><FiMapPin /> {vet.city}</span>}
            {vet.consultationFee != null && (
              <span className="flex items-center gap-1"><FiDollarSign /> {vet.consultationFee} consultation</span>
            )}
          </div>
          {vet.bio && <p className="mt-3 text-sm text-text-muted">{vet.bio}</p>}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-text">Book an Appointment</h2>

        {!user && (
          <p className="mt-3 rounded-md border border-border bg-surface p-4 text-sm text-text-muted theme-transition">
            Please <Link to="/login" className="font-medium text-primary hover:underline">log in</Link> as a pet owner to book an appointment.
          </p>
        )}

        {user && user.role !== "owner" && (
          <p className="mt-3 rounded-md border border-border bg-surface p-4 text-sm text-text-muted theme-transition">
            Only pet owner accounts can book appointments.
          </p>
        )}

        {user && user.role === "owner" && (
          <form onSubmit={handleBook} className="mt-4 space-y-4 rounded-lg border border-border bg-surface p-6 theme-transition">
            {pets.length === 0 ? (
              <p className="text-sm text-text-muted">
                You need to <Link to="/dashboard/pets/new" className="font-medium text-primary hover:underline">add a pet</Link> before booking.
              </p>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Pet</label>
                <select
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
                >
                  {pets.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} ({p.species})</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-text">Date</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dateOptions.map((d) => {
                  const value = format(d, "yyyy-MM-dd");
                  const active = value === selectedDate;
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setSelectedDate(value)}
                      className={`shrink-0 rounded-md border px-3 py-2 text-xs font-medium ${
                        active ? "border-primary bg-primary text-white" : "border-border text-text hover:border-primary"
                      }`}
                    >
                      {format(d, "EEE, MMM d")}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">Time slot</label>
              {slotsLoading ? (
                <div className="flex justify-center py-4"><LoadingSpinner /></div>
              ) : slots.length === 0 ? (
                <p className="text-sm text-text-muted">No available slots on this date.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                        selectedSlot === slot ? "border-primary bg-primary text-white" : "border-border text-text hover:border-primary"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">Reason for visit</label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Annual checkup, limping on left leg..."
                className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || pets.length === 0}
              className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? "Requesting..." : "Request Appointment"}
            </button>
          </form>
        )}
      </div>

      <ReviewSection
        fetchReviews={() => reviewService.getVetReviews(vet.user._id)}
        submitReview={(payload) => reviewService.createVetReview({ veterinarian: vet.user._id, ...payload })}
        canReview={user?.role === "owner"}
        restrictionNote="You can leave a review after completing an appointment with this veterinarian."
      />
    </div>
  );
}

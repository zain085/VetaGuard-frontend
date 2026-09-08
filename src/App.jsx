import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PublicLayout from "./layouts/PublicLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import VetLayout from "./layouts/VetLayout";
import ShelterLayout from "./layouts/ShelterLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Route-level code splitting: each page loads only when its route is visited.
// This keeps the initial bundle lean — heavy dependencies used by a single
// section (e.g. Recharts, used only by the admin dashboard) never ship to
// visitors who never go there.
const Home = lazy(() => import("./pages/public/Home"));
const About = lazy(() => import("./pages/public/About"));
const Vets = lazy(() => import("./pages/public/Vets"));
const VetDetail = lazy(() => import("./pages/public/VetDetail"));
const Adoption = lazy(() => import("./pages/public/Adoption"));
const AdoptionDetail = lazy(() => import("./pages/public/AdoptionDetail"));
const Shop = lazy(() => import("./pages/public/Shop"));
const ProductDetail = lazy(() => import("./pages/public/ProductDetail"));
const Cart = lazy(() => import("./pages/public/Cart"));
const Care = lazy(() => import("./pages/public/Care"));
const CareArticleDetail = lazy(() => import("./pages/public/CareArticleDetail"));
const Contact = lazy(() => import("./pages/public/Contact"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

const OwnerDashboard = lazy(() => import("./pages/owner/Dashboard"));
const Pets = lazy(() => import("./pages/owner/Pets"));
const PetForm = lazy(() => import("./pages/owner/PetForm"));
const PetDetail = lazy(() => import("./pages/owner/PetDetail"));
const OwnerAppointments = lazy(() => import("./pages/owner/Appointments"));
const OwnerApplications = lazy(() => import("./pages/owner/Applications"));
const Reminders = lazy(() => import("./pages/owner/Reminders"));

const VetDashboard = lazy(() => import("./pages/vet/Dashboard"));
const VetAppointments = lazy(() => import("./pages/vet/Appointments"));
const VetAvailability = lazy(() => import("./pages/vet/Availability"));
const VetProfilePage = lazy(() => import("./pages/vet/Profile"));

const ShelterDashboard = lazy(() => import("./pages/shelter/Dashboard"));
const ShelterPets = lazy(() => import("./pages/shelter/Pets"));
const ShelterPetForm = lazy(() => import("./pages/shelter/PetForm"));
const ShelterApplications = lazy(() => import("./pages/shelter/Applications"));
const ShelterProfile = lazy(() => import("./pages/shelter/Profile"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminVets = lazy(() => import("./pages/admin/Vets"));
const AdminShelters = lazy(() => import("./pages/admin/Shelters"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminArticles = lazy(() => import("./pages/admin/Articles"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner className="h-8 w-8" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/vets" element={<Vets />} />
            <Route path="/vets/:id" element={<VetDetail />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/adoption/:id" element={<AdoptionDetail />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/care" element={<Care />} />
            <Route path="/care/:slug" element={<CareArticleDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["owner", "admin"]} />}>
            <Route element={<OwnerLayout />}>
              <Route path="/dashboard" element={<OwnerDashboard />} />
              <Route path="/dashboard/pets" element={<Pets />} />
              <Route path="/dashboard/pets/new" element={<PetForm />} />
              <Route path="/dashboard/pets/:id" element={<PetDetail />} />
              <Route path="/dashboard/appointments" element={<OwnerAppointments />} />
              <Route path="/dashboard/applications" element={<OwnerApplications />} />
              <Route path="/dashboard/reminders" element={<Reminders />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["vet"]} />}>
            <Route element={<VetLayout />}>
              <Route path="/vet/dashboard" element={<VetDashboard />} />
              <Route path="/vet/appointments" element={<VetAppointments />} />
              <Route path="/vet/availability" element={<VetAvailability />} />
              <Route path="/vet/profile" element={<VetProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["shelter"]} />}>
            <Route element={<ShelterLayout />}>
              <Route path="/shelter/dashboard" element={<ShelterDashboard />} />
              <Route path="/shelter/pets" element={<ShelterPets />} />
              <Route path="/shelter/pets/new" element={<ShelterPetForm />} />
              <Route path="/shelter/applications" element={<ShelterApplications />} />
              <Route path="/shelter/profile" element={<ShelterProfile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/vets" element={<AdminVets />} />
              <Route path="/admin/shelters" element={<AdminShelters />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

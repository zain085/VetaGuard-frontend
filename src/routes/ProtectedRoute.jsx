import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// allowedRoles omitted => any authenticated user may pass
export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const homeByRole = { vet: "/vet/dashboard", owner: "/dashboard", admin: "/admin", shelter: "/shelter/dashboard" };
    return <Navigate to={homeByRole[user.role] || "/"} replace />;
  }

  return <Outlet />;
}

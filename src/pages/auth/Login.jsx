import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema } from "../../schemas/auth.schema";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/common/Logo";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function Login() {
  useDocumentTitle("Log In");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const loggedInUser = await login(values);
      toast.success("Welcome back!");
      navigate(loggedInUser.role === "vet" ? "/vet/dashboard" : loggedInUser.role === "shelter" ? "/shelter/dashboard" : loggedInUser.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setServerError(err.friendlyMessage || "Unable to log in");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-1px)] items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-md theme-transition">
        <div className="mb-6 flex justify-center">
          <Logo className="h-12 w-12" />
        </div>
        <h1 className="text-center text-xl font-semibold text-text">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-text-muted">Log in to your VetaGuard account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          {serverError && (
            <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {serverError}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

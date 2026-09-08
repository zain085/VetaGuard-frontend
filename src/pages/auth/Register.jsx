import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { registerSchema } from "../../schemas/auth.schema";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../components/common/Logo";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const roles = [
  { value: "owner", label: "Pet Owner" },
  { value: "vet", label: "Veterinarian" },
  { value: "shelter", label: "Animal Shelter" },
];

export default function Register() {
  useDocumentTitle("Sign Up");
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { role: "owner" } });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const { confirmPassword, ...payload } = values;
      const newUser = await registerUser(payload);
      toast.success("Account created — welcome to VetaGuard!");
      navigate(newUser.role === "vet" ? "/vet/dashboard" : newUser.role === "shelter" ? "/shelter/dashboard" : "/dashboard");
    } catch (err) {
      setServerError(err.friendlyMessage || "Unable to create account");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-1px)] items-center justify-center bg-bg px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-md theme-transition">
        <div className="mb-6 flex justify-center">
          <Logo className="h-12 w-12" />
        </div>
        <h1 className="text-center text-xl font-semibold text-text">Create your account</h1>
        <p className="mt-1 text-center text-sm text-text-muted">Join VetaGuard in a minute</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          {serverError && (
            <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {serverError}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>
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
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="role">
              I am a...
            </label>
            <select
              id="role"
              {...register("role")}
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {errors.role && <p className="mt-1 text-xs text-danger">{errors.role.message}</p>}
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
          <div>
            <label className="mb-1 block text-sm font-medium text-text" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-danger">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page Not Found");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <Logo className="h-14 w-14" />
      <h1 className="mt-6 text-4xl font-bold text-text">404</h1>
      <p className="mt-2 text-text-muted">This page wandered off. Let's get you back on track.</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
      >
        Back to home
      </Link>
    </div>
  );
}

export default function LoadingSpinner({ className = "h-6 w-6" }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${className}`}
    />
  );
}

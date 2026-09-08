import { useEffect } from "react";

// Sets the document title for the current page and public Open Graph-ish basics.
// Restores the previous title on unmount so navigating away doesn't leak state.
export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · VetaGuard` : "VetaGuard — Smarter Care. Healthier Pets. Stronger Bonds.";
    return () => {
      document.title = previous;
    };
  }, [title]);
}

import { Link } from "react-router-dom";
import Logo from "../common/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface theme-transition">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <Logo className="h-8 w-8" withWordmark wordmarkClassName="text-lg" />
            <p className="mt-3 max-w-xs text-sm text-text-muted">
              Smarter Care. Healthier Pets. Stronger Bonds.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text">Services</h4>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              <li><Link to="/vets" className="hover:text-primary">Find a Vet</Link></li>
              <li><Link to="/adoption" className="hover:text-primary">Adoption</Link></li>
              <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-text-muted">
              <li><Link to="/care" className="hover:text-primary">Care Articles</Link></li>
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} VetaGuard. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            <Link to="/terms" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
